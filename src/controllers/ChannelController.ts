import { Request, Response } from "express"
import { getRepository, Repository, } from "typeorm";
import { validate } from "class-validator";

import { User, Organisation, UserOrgansisation, Channel } from "../entity";

const useRepository = () => {
    const repositories = {}
    return (entity: any, name: string) => {
        if (repositories[name]) return repositories[name]
        return getRepository(entity)
    }
}
class ChannelController {
    // static listAll = async (req: Request, res: Response) => {
    //     const 


    // }
    static create = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body
            let channel = new Channel()
            channel = { ...channel, name, description }
            const organisationRepo = useRepository()(Organisation, "organisation");
            const userRepo = useRepository()(User, "user")

            const user = await userRepo.findOne(res.locals.jwtPayload.userId)

            let org = await organisationRepo.findOne({ where: user })
            if (!org) {
                return res.status(401).json({
                    success: true, data: {
                        error: "invalid user"
                    }
                })
            }

            org.channel = org.channel ? [channel] : [...org.channel, channel]

            org = await organisationRepo.save(org)
            if (!org) {
                return res.status(401).json({
                    success: true, data: {
                        error: "failed to create channel"
                    }
                })
            }

            res.status(201).json({ success: true, data: org })
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
}

export default ChannelController