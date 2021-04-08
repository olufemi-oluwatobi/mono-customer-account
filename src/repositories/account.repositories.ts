import { Customer, Account, Transaction } from "../entities"
import { getRepository, Repository } from "typeorm";
import { container, Types } from "../config/di/container"
import { injectable } from "inversify"
import { AccountServices, AccountTypeParams } from "../config/interfaces"
import { AccountType, AccountTransaction } from "../entities";





@injectable()

class AccountRepository {
    private accountRepo: Repository<Account>
    private accountService: AccountServices
    private accountTypeRepo: Repository<AccountType>
    private accountTransaction: Repository<AccountTransaction>

    private loadRepos = () => {
        if (![this.accountRepo, this.accountService, this.accountTypeRepo].some(Boolean)) {
            this.accountRepo = getRepository(Account)
            this.accountTypeRepo = getRepository(AccountType)
            this.accountTransaction = getRepository(AccountTransaction)
            this.accountService = container.get<AccountServices>(Types.AccountService)
        }
    }
    createAccount = async (customer: Customer, accountType: AccountType, initialDeposit: number) => {
        try {
            this.loadRepos()
            console.log(customer, accountType, initialDeposit)
            const account = new Account()
            account.customer = customer;
            account.accountType = accountType;
            account.balance = initialDeposit;
            account.number = await this.accountService.genereteAccountNumber();

            return this.accountRepo.save(account)
        }
        catch (error) {
            console.log(error)
        }
    }

    findAccountType = async (params: AccountTypeParams) => {
        this.loadRepos()
        return this.accountTypeRepo.findOne({ where: params })
    }


    findAccount = async (params: { id?: number, customer?: Customer, number?: number }, multiple: boolean = false, relations: string[] = []) => {
        this.loadRepos()
        const fetchMethod = multiple ? "find" : "findOne"

        return this.accountRepo[fetchMethod]({ where: params, relations })
    }
    debit = async (account: Account, amount: number, transaction: Transaction) => {
        this.loadRepos()
        account.balance = account.balance - amount
        await this.accountRepo.save(account)
        const accountTransaction = new AccountTransaction()
        accountTransaction.transactionType = "debit"
        accountTransaction.balanceAsAtTransaction = account.balance;
        accountTransaction.account = account;
        accountTransaction.transaction = transaction
        return this.accountTransaction.save(accountTransaction)
    }


    credit = async (account: Account, amount: number, transaction: Transaction) => {
        this.loadRepos()
        account.balance = account.balance + amount
        await this.accountRepo.save(account)

        const accountTransaction = new AccountTransaction()
        accountTransaction.transactionType = "credit"
        accountTransaction.balanceAsAtTransaction = account.balance;
        accountTransaction.account = account;
        accountTransaction.transaction = transaction
        return this.accountTransaction.save(accountTransaction)
    }

    transactionHistory = (account: Account) => {
        console.log(account)
        this.loadRepos()
        return this.accountTransaction.find({ where: { account }, relations: ["transaction"] })
    }

}

export default AccountRepository
