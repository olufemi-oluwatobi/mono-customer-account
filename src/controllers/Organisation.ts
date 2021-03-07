import { Request, Response } from "express"
import { getRepository, Repository, EntityOptions } from "typeorm";
import { validate } from "class-validator";
import slugify from "slugify"

import { User, Organisation, UserOrgansisation } from "../entity";

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
    static show = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            const { userId } = res.locals.jwtPayload;
            const { slug } = req.params
            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")

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
            const orgClone = { ...organisation };
            const members = orgClone.userOrganisation
            delete orgClone.userOrganisation
            res.status(200).json({ success: true, data: { ...orgClone, members } })
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