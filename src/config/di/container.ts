import { Container } from "inversify"
import "reflect-metadata"
import { CustomerRepository, AccountRepository, TransactionRepository } from "../../repositories"
import { AccountService } from "../../services"
import Types from "./types"


const container = new Container()
container.bind<CustomerRepository>(Types.CustomerRepository).to(CustomerRepository)
container.bind<AccountRepository>(Types.AccountRepository).to(AccountRepository)
container.bind<AccountService>(Types.AccountService).to(AccountService);
container.bind<TransactionRepository>(Types.TransactionRepository).to(TransactionRepository)

export { container, Types }