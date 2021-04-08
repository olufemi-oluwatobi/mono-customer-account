import { Customer, Transaction, Account } from "../entities"
import { getRepository, In, Repository, } from "typeorm"
import { injectable } from "inversify";
import { container, Types } from "../config/di/container"
import { CustomerQueryParams, CustomerCreateBody } from "../config/interfaces"
import { AccountServices, AccountTypeParams, AccountRepository } from "../config/interfaces"
import { AccountType } from "../entities/accountType";





@injectable()

class TransactionRepository {
    private accountRepo: AccountRepository
    private accountService: AccountServices
    private accountTypeRepo: Repository<AccountType>
    private transactionRepo: Repository<Transaction>

    loadRepos = () => {
        if (![this.accountRepo, this.accountService, this.accountTypeRepo, this.transactionRepo].some(Boolean)) {
            this.accountTypeRepo = getRepository(AccountType)
            this.accountService = container.get<AccountServices>(Types.AccountService)
            this.accountRepo = container.get<AccountRepository>(Types.AccountRepository);
            this.transactionRepo = getRepository(Transaction)
        }
    }
    createTransaction = (sender: Account, reciepient: Account, amount: number) => {
        this.loadRepos()
        const transaction = new Transaction()
        transaction.sender = sender;
        transaction.recipient = reciepient;
        transaction.amount = amount;
        return this.transactionRepo.save(transaction)
    }
}

export default TransactionRepository
