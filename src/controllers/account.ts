import { Request, Response } from "express"
import { getRepository, Repository, EntityOptions } from "typeorm";
import { validate } from "class-validator";
import { container, Types } from "../config/di/container"
import { AccountRepository, CustomerRepository } from "../config/interfaces"


const accountRepo = container.get<AccountRepository>(Types.AccountRepository)
const customerRepo = container.get<CustomerRepository>(Types.CustomerRepository)



class AccountController {
    static create = async (req: Request, res: Response) => {
        try {
            const { customerId, type, initialDeposit } = req.body
            const customer = await customerRepo.findCustomer({ id: customerId })
            if (!customer) {
                return res.status(404).json({ success: false, message: "invalid customer" })
            }

            const accountType = await accountRepo.findAccountType({ name: type })
            if (!accountType) {
                res.status(400).json({ success: false, message: "invalid account type" })
            }
            const account = await accountRepo.createAccount(customer, accountType, initialDeposit)
            console.log(account)
            return res.status(201).json({ success: true, data: account })

        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }

    static getAccountBalance = async (req: Request, res: Response) => {
        try {
            let { id } = req.params
            const account = await accountRepo.findAccount({ id })
            if (!account) {
                res.status(400).json({ success: false, error: "Invalid account" })
            }
            return res.status(200).json({ success: true, data: account.balance })

        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
}

export default AccountController