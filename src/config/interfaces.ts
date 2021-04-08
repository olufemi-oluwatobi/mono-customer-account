import * as EventEmitter from "events"
import { Customer, Account, AccountType, Transaction, AccountTransaction } from "../entities"


export type AccountQueryParams = { id?: number | string, customer?: Customer, number?: string }
export type CustomerQueryParams = { id?: number, name?: string }
export type CustomerCreateBody = { name: string }
export type AccountTypeParams = { id?: number, name?: string }

export interface CustomerRepository {
    findCustomer: (params: CustomerQueryParams) => Promise<Customer>
    createCustomer: (body: CustomerCreateBody) => Promise<Customer>
}

export interface AccountRepository {
    /**
     * Create Customer Account
     */
    createAccount: (customer: Customer, accountType: AccountType, initialDeposit: number) => Promise<Account>;

    /**
    * find Customer account by params
    * @param param {object} Param object
    * @param multiple {boolean} Return one or more accounts that match param criteria
    */
    findAccount: (params: AccountQueryParams, multiple?: boolean, relations?: string[]) => Promise<Account>;


    /**
   * find Account Types  by params
   * @param param {object} Param object
   *
   */
    findAccountType: (params: AccountTypeParams) => Promise<AccountType | null>;

    getTransactionHistory: (account: Account) => Promise<Transaction>
    debit: (account: Account, amount: number, transaction: Transaction) => Promise<Account>
    credit: (account: Account, amount: number, transaction: Transaction) => Promise<Account>
    transactionHistory: (account: Account) => Promise<AccountTransaction>
}

export interface AccountServices {
    genereteAccountNumber: (prefix?: string) => Promise<string>
}

export interface TransactionRepository {
    createTransaction: (sender: Account, reciepient: Account, amount: number) => Promise<Transaction>
    getTransactionHistory: (account: Account) => Promise<Transaction>
}