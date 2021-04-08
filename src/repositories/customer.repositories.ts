import { Customer } from "../entities"
import { getRepository, In, Repository } from "typeorm"
import { injectable } from "inversify"
import { CustomerQueryParams, CustomerCreateBody } from "../config/interfaces"
import { relative } from "path"





@injectable()

class CustomerRepository {
    private customerRepo: Repository<Customer>

    loadRepos = () => {
        if (!this.customerRepo) {
            this.customerRepo = getRepository(Customer)
        }
    }
    findCustomer = async (params: CustomerQueryParams) => {
        this.loadRepos()
        return this.customerRepo.findOne({ where: { params }, relations: ["accounts"] })
    }

    createCustomers = async (body: CustomerCreateBody) => {
        this.loadRepos()
        return this.customerRepo.findOne({ where: { body }, relations: ["accounts"] })
    }

}

export default CustomerRepository
