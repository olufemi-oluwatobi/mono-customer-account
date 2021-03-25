import { Request, Response } from "express"
import { getRepository, Repository, EntityOptions } from "typeorm";
import { validate } from "class-validator";
import { InvitationCode } from "../entity/invitationCode"
import Types from "../config/di/types"
import { container } from "../config/di/container"
import { Mail, MessageRepository } from "../config/interfaces";
import { Channel } from "../entity/channel";
import invitationTemplate from "../templates/invitation.template"
import accessCodeTemplate from "../templates/accesscode.template"
import slugify from "slugify"

const mail = container.get<Mail>(Types.MailService)
const messageRepo = container.get<MessageRepository>(Types.MessageRepository)

import { User, Organisation, UserOrgansisation, AccessCode, ChannelMembers } from "../entity";

const useRepository = () => {
    const repositories = {}
    return (entity, name: string) => {
        if (repositories[name]) return repositories[name]
        return getRepository(entity)
    }
}
class OrganisationController {
    static index = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;

            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")
            // const user = await userRepo.find({ id: userId, relations: ["organisations"] })
            // console.log(user)
            console.log(userId)
            let userOrg = await organisationRepo.createQueryBuilder('org')
                .innerJoin(
                    'org.userOrganisation',
                    'userOrganisation',
                    'userOrganisation.userId = :userId',
                    { userId }
                )
                .getMany()

            const ids = userOrg.map(({ id }) => id)
            console.log(ids)
            for (let id of ids) {
                console.log(id)
                const org = await getRepository(Organisation).findOne({ where: { id }, relations: ["userOrganisation"] })
                console.log(org)
                const index = ids.findIndex(i => i === id)
                userOrg[index].memberCount = org.userOrganisation.length
            }



            res.status(200).json({ success: true, data: userOrg })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }

    static userMessages = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { slug } = req.params
            const organisationRepo = getRepository(Organisation)
            const userOrgRepo = getRepository(UserOrgansisation)
            const channelsRepo = getRepository(Channel)
            const channelsMembersRepo = getRepository(ChannelMembers)

            const userRepo = useRepository()(User, "user")

            const user = await userRepo.findOne({ where: { id: userId } })
            const organisation = await organisationRepo.findOne({ where: { slug }, relations: ["channels"] })
            let userOrg = await userOrgRepo.findOne({ where: { organisation, user }, relations: ["user", "organisation"] })

            if (!userOrg) {
                return res.status(400).json({ success: false, data: { error: "You don't belong to this organisation" } })
            }
            const userChannels = await channelsMembersRepo.find({ where: { channel: organisation.channels, user }, relations: ["channel", "user"] })
            console.log(userChannels, organisation)
            const usersMessages = await messageRepo.findMessages({ orgUser: userOrg, channelIds: organisation.channels.map(channel => channel.chatId) })
            res.status(200).json({ success: false, data: usersMessages })

        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }

    static show = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { slug } = req.params
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userOrgRepo = useRepository()(UserOrgansisation, "userOrg")
            const userRepo = useRepository()(User, "user")
            const invitation = new InvitationCode()

            const user = await userRepo.findOne({ where: { id: userId } })
            let userOrg = await organisationRepo.createQueryBuilder('org').where("org.slug = :slug", { slug })
                .innerJoin(
                    'org.userOrganisation',
                    'userOrganisation',
                    'userOrganisation.userId = :userId',
                    { userId }
                )

            if (!userOrg) {
                return res.status(400).json({ success: false, data: { error: "You don't belong to this organisation" } })
            }

            const organisation = await getRepository(Organisation).findOne({ where: { slug }, relations: ["userOrganisation", "userOrganisation.user", "channels"] })
            if (!organisation) {
                return res.status(404).json({ success: false, data: { error: "Organisation doesn't exist" } })
            }
            const orgUser = await userOrgRepo.findOne({ where: { user, organisation } })
            console.log(orgUser)
            const orgClone = { ...organisation };
            const members = orgClone.userOrganisation
            delete orgClone.userOrganisation
            console.log(userOrg)
            res.status(200).json({ success: true, data: { ...orgClone, members, uuid: orgUser.chatId } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
    static invites = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { inviteId } = req.params
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")
            const invitationRepo = useRepository()(InvitationCode, "organisation")
            const invite = await invitationRepo.findOne({ where: { inviteId } })
            if (!invite) {
                return res.status(401).json({ success: false, data: { error: "Invalid invite" } })
            }
            const organisation = await getRepository(Organisation).findOne({ where: { id: invite.organisationId }, relations: ["userOrganisation", "userOrganisation.user", "channels"] })
            if (!organisation) {
                return res.status(404).json({ success: false, data: { error: "Organisation doesn't exist" } })
            }
            const orgClone = { ...organisation };
            const members = orgClone.userOrganisation
            delete orgClone.userOrganisation
            res.status(200).json({ success: true, data: { ...orgClone, members } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }

    static accept = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { invitationId, id } = req.params
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")
            const userOrgRepo = useRepository()(UserOrgansisation, "userOrg")
            const invitationRepo = useRepository()(InvitationCode, "organisation")
            let userOrganisation = new UserOrgansisation()

            const invite = await invitationRepo.findOne({ where: { invitationId } })
            if (!invite) {
                return res.status(401).json({ success: false, data: { error: "Invalid invite" } })
            }
            const organisation = await getRepository(Organisation).findOne({ where: { id: invite.organisationId }, relations: ["userOrganisation", "userOrganisation.user", "channels"] })
            if (!organisation) {
                return res.status(404).json({ success: false, data: { error: "Organisation doesn't exist" } })
            }
            const user = await userRepo.findOne(res.locals.jwtPayload.userId)

            userOrganisation.role = "user"
            userOrganisation.user = user
            userOrganisation.organisation = organisation

            await userOrgRepo.save(userOrganisation)

            const organisationUsers = await userOrgRepo.find({ where: { organisation: org } })
            delete org.userOrganisation
            await invitationRepo.remove(invite)

            // user.organisations.push(org)
            // userOrg.organisation = org
            // userOrg.user = user
            // userOrg.role = "admin"


            res.status(201).json({ success: true, data: { ...organisation, memberCount: organisationUsers.length } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }



    static reject = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { inviteId } = req.params
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")
            const invitationRepo = useRepository()(InvitationCode, "organisation")
            const invite = await invitationRepo.findOne({ where: { inviteId } })
            if (!invite) {
                return res.status(401).json({ success: false, data: { error: "Invalid invite" } })
            }
            const organisation = await getRepository(Organisation).findOne({ where: { id: invite.organisationId }, relations: ["userOrganisation", "userOrganisation.user", "channels"] })
            if (!organisation) {
                return res.status(404).json({ success: false, data: { error: "Organisation doesn't exist" } })
            }
            await invitationRepo.delete(invite)
            res.status(200).json({ success: true, data: { message: "Invitation Rejected", organisationId: organisation.id } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
    static invite = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { slug } = req.params
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")
            const { emails } = req.body
            const invitationRepo = useRepository()(InvitationCode, "user")

            let userOrg = await organisationRepo.createQueryBuilder('org').where("org.slug = :slug", { slug })
                .innerJoin(
                    'org.userOrganisation',
                    'userOrganisation',
                    'userOrganisation.userId = :userId',
                    { userId }
                )

            if (!userOrg) {
                return res.status(400).json({ success: false, data: { error: "You don't belong to this organisation" } })
            }

            const organisation = await getRepository(Organisation).findOne({ where: { slug }, relations: ["userOrganisation", "userOrganisation.user", "channels"] })
            if (!organisation) {
                return res.status(404).json({ success: false, data: { error: "Organisation doesn't exist" } })
            }
            emails.forEach((email: string) => {

                const code = Math.floor(Math.random() * 90000) + 10000;
                const invitation = new InvitationCode()
                invitation.code = code;
                invitation.organisationId = organisation.id

                // change reciepient to email
                const link = `http://localhost:6090?ivId=${code}`
                mail.sendMail({ from: "i360chat@chat.com", to: "olufemiotosin@gmail.com", subject: `Invitation to Join ${organisation.name}`, text: invitationTemplate({ link, organisation: organisation.name }) })

                invitationRepo.save(invitation)
            })



            res.status(200).json({ success: true, data: { message: "invitation sent" } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
    static create = async (req: Request, res: Response) => {
        try {
            console.log("locals", "herree")
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userOrgRepo = useRepository()(UserOrgansisation, "userOrg")

            let org = new Organisation()
            let userOrganisation = new UserOrgansisation()


            let { name } = req.body;
            console.log(org)

            const existingOrg = await organisationRepo.createQueryBuilder("organisation")
                .where("organisation.name like :name", { name: `%${name}%` })
                .getMany();
            console.log(existingOrg)
            if (existingOrg.length) {
                res.status(400).json({
                    data: {
                        error: "name has been taken"
                    }
                })
                return
            }

            org.name = name

            const errors = await validate(org)
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }



            const userRepo = useRepository()(User, "user")
            console.log(res.locals.jwtPayload.userId)
            const user = await userRepo.findOne(res.locals.jwtPayload.userId)
            //console.log(user)
            //org.userOrganisation = !org.userOrganisation ? [{ ...user, role: "admin" }] : [...org.userOrganisation, { ...user, role: "admin" }]



            try {
                org = await organisationRepo.save(org)
            } catch (error) {
                console.log(error)
                res.status(400).json({ data: { error } })
                return
            }
            userOrganisation.role = "admin"
            userOrganisation.user = user
            userOrganisation.organisation = org

            await userOrgRepo.save(userOrganisation)

            const organisationUsers = await userOrgRepo.find({ where: { organisation: org } })
            delete org.userOrganisation
            // user.organisations.push(org)
            // userOrg.organisation = org
            // userOrg.user = user
            // userOrg.role = "admin"


            res.status(201).json({ success: true, data: { ...org, memberCount: organisationUsers.length } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
}

export default OrganisationController