import { Request, response, Response } from "express"
import { getRepository, Repository, } from "typeorm";
import { In } from "typeorm";
import { v4 as uuid } from "uuid"
import { validate } from "class-validator";

import { User, Organisation, UserOrgansisation, Channel } from "../entity";
import { ChannelMembers } from "../entity/channelMembers";

const useRepository = () => {
    const repositories = {}
    return (entity: any, name: string) => {
        if (repositories[name]) return repositories[name]
        repositories[name] = getRepository(entity)
        return repositories[name]
    }
}
const repositories = useRepository()
class ChannelController {
    // static listAll = async (req: Request, res: Response) => {
    //     const 


    // }

    static index = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            const { organisationSlug } = req.params
            const { userId } = res.locals.jwtPayload

            const organisationRepo = repositories(Organisation, "organisation");
            const userRepo = repositories(User, "user")
            const channelRepo = repositories(Channel, "channel")
            const channelMembersRepo = repositories(ChannelMembers, "channelMembers")
            const user = await userRepo.findOne({ where: { id: userId } })
            console.log(organisationSlug)
            const org = await organisationRepo.findOne({ where: { slug: organisationSlug } })
            let userOrg = await organisationRepo.createQueryBuilder('org').where("org.id = :id", { id: org.id })
                .innerJoin(
                    'org.userOrganisation',
                    'userOrganisation',
                    'userOrganisation.userId = :userId',
                    { userId }
                )

            if (!userOrg) {
                return res.status(401).json({
                    success: true, data: {
                        error: "invalid user"
                    }
                })
            }
            console.log(org)
            const userChannel = await channelMembersRepo.createQueryBuilder("channelMember")
                .leftJoinAndSelect('channelMember.channel', 'channel')
                .leftJoinAndSelect('channelMember.user', 'members')
                .where("members.userId = :id", { id: userId })
                .where("channel.organisationId = :id", { id: org.id })
                .getMany();
            const channelIds = userChannel.map(channel => channel.channel.id)
            let channel = await channelRepo.find({ where: { organisation: org, id: In(channelIds) }, relations: ["channelMembers", "channelMembers.user"] })

            res.status(200).json({ success: true, data: channel })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
    static create = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            const { organisationId } = req.params
            const { userId } = res.locals.jwtPayload
            console.log(organisationId)
            let channel = new Channel()
            let channelMembers = new ChannelMembers()
            channel.name = name;
            channel.description = description
            const organisationRepo = repositories(Organisation, "organisation");
            const userRepo = repositories(User, "user")
            const userOrgRepo = repositories(UserOrgansisation, "userOrg")
            const channelRepo = repositories(Channel, "channel")
            const channelMembersRepo = repositories(ChannelMembers, "channelMembers")
            const user = await userRepo.findOne({ where: { id: userId } });
            let userOrg = await organisationRepo.createQueryBuilder('org').where("org.id = :id", { organisationId })
                .innerJoin(
                    'org.userOrganisation',
                    'userOrganisation',
                    'userOrganisation.userId = :userId',
                    { userId }
                )

            if (!userOrg) {
                return res.status(401).json({
                    success: true, data: {
                        error: "invalid user"
                    }
                })
            }
            let org: Organisation = await organisationRepo.findOne({ where: { id: organisationId } })
            const orgUser = await userOrgRepo.findOne({ where: { user, organisation: org } })
            console.log(orgUser)
            // org.channels = !org.channels ? [channel] : [...org.channels, channel]

            org = await organisationRepo.save(org)

            if (!org) {
                return res.status(401).json({
                    success: true, data: {
                        error: "failed to create channel"
                    }
                })
            }
            channel.organisation = org
            channel.chatId = `channel_${uuid()}`
            //channel.channelMembers = !channel.channelMembers ? [user] : [...channel.channelMembers, user]

            channel = await channelRepo.save({ ...channel, organisationId: org.id })
            console.log("channel", channel)
            channelMembers.channel = channel;
            channelMembers.user = user
            channelMembers.role = "admin"
            channelMembers.chatId = orgUser.chatId
            console.log(orgUser)
            await channelMembersRepo.save(channelMembers)

            res.status(201).json({ success: true, data: channel })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
}

export default ChannelController