import { injectable } from "inversify"
import { container } from "../config/di/container"
import Types from "../config/di/types"
import { AccountRepository } from "../config/interfaces"
import { ACCOUNT_NUMBER_PREFIXES } from "../config/constants"



const FAILED_ACCOUNT_NUMBERS = []


@injectable()

class AccountService {
    private accountRepo: AccountRepository
    constructor() {
        this.accountRepo = container.get<AccountRepository>(Types.AccountRepository)
    }
    async genereteAccountNumber(prefix?: string): Promise<string> {
        let isUnique: null | boolean
        let accountNumber: string

        try {
            while (!isUnique) {
                // get random prefix
                const accountPrefix = prefix || ACCOUNT_NUMBER_PREFIXES[Math.floor(Math.random() * ACCOUNT_NUMBER_PREFIXES.length)]
                const accountDigits = Math.floor(Math.random() * 90000) + 10000;
                accountNumber = accountPrefix + accountDigits;
                if (!FAILED_ACCOUNT_NUMBERS.includes(accountNumber)) {
                    const alreadyExists = await this.accountRepo.findAccount({ number: accountNumber }, false)
                    if (alreadyExists) {
                        FAILED_ACCOUNT_NUMBERS.push(accountNumber)
                    } else {
                        isUnique = true
                        break;
                    }
                }
            }
            return accountNumber

        } catch (error) {
        }


    }

}

export default AccountService