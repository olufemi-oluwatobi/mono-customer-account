import { Request, Response } from "express"
import { getRepository, Repository, Entity } from "typeorm";
import { validate } from "class-validator";

import { User, Organisation, UserOrgansisation } from "../entity";

const useRepository = () => {
    const repositories = {}
    return (entity: any, name: string) => {
        if (repositories[name]) return repositories[name]
        return getRepository(entity)
    }
}
class OrganisationController {
    // static listAll = async (req: Request, res: Response) => {
    //     const 


    // }
    static create = async (req: Request, res: Response) => {
        try {
            console.log("locals", res.locals)
            let org = new Organisation()
            let { name } = req.body;
            console.log(org)
            org.name = name
            org.customer_chat_url = `/customer/${name}`

            const errors = await validate(org)
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const organisationRepo = useRepository()(Organisation, "organisation")
            const userRepo = useRepository()(User, "user")
            console.log(res.locals.jwtPayload.userId)
            const user = await userRepo.findOne(res.locals.jwtPayload.userId)
            //console.log(user)
            org.user = [user]
            const userOrg = new UserOrgansisation()

            try {
                org = await organisationRepo.save(org)
            } catch (error) {
                res.status(400).json({ data: { error } })
                return
            }

            // user.organisations.push(org)
            // userOrg.organisation = org
            // userOrg.user = user
            // userOrg.role = "admin"


            res.status(201).json({ success: true, data: org })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
}

export default OrganisationController