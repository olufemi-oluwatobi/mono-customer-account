import { Request, Response } from "express"
import { container, Types } from "../../config/di/container"
import { AccountRepository, TransactionRepository } from "../../config/interfaces"


const accountRepo = container.get<AccountRepository>(Types.AccountRepository)
const transactionRepo = container.get<TransactionRepository>(Types.TransactionRepository)



class TransactionController {
    static create = async (req: Request, res: Response) => {
        try {
            const { senderAccountId, recipientAccountId, amount, currency } = req.body
            const senderAccount = await accountRepo.findAccount({ id: senderAccountId }, false, ["accountType"])
            if (!senderAccount) {
                return res.status(404).json({ success: false, message: "invalid sender account" })
            }

            if (senderAccount.accountType.currency !== currency) {
                return res.status(401).json({ success: false, message: "Can't proccess multi currency transactions" })
            }

            const recipientAccount = await accountRepo.findAccount({ id: recipientAccountId }, false, ["accountType"])
            if (!recipientAccount) {
                return res.status(404).json({ success: false, message: "invalid recipient account" })
            }

            if (recipientAccount.accountType.currency !== senderAccount.accountType.currency) {
                return res.status(401).json({ success: false, message: "Can't proccess multi currency transactions" })
            }

            if (senderAccount.balance < amount) {
                return res.status(401).json({ success: false, message: "Insuficient funds" })
            }


            const transaction = await transactionRepo.createTransaction(senderAccount, recipientAccountId, amount)
            await accountRepo.debit(senderAccount, amount, transaction)
            await accountRepo.credit(recipientAccount, amount, transaction)
            return res.status(201).json({ success: true, message: "Transaction Successful", data: transaction })

        } catch (error) {
            res.status(400).json({ success: false, data: error.toString() })
        }
    }

    static history = async (req: Request, res: Response) => {
        try {
            const { accountId } = req.params
            const account = await accountRepo.findAccount({ id: accountId }, false)
            if (!account) {
                return res.status(200).json({ success: false, message: "invalid account" })
            }

            const accountHistory = await accountRepo.transactionHistory(account)
            // const transactions = transactionRepo.getTransactionHistory(account)
            return res.status(200).json({ success: true, data: accountHistory })

        } catch (error) {
            res.status(400).json({ success: false, data: error.toString() })
        }
    }
}

export default TransactionController