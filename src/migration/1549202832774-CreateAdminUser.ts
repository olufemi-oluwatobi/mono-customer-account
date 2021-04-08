import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Customer } from "../entities/customer";

const dummyCustomers = [
  "Abba Kyari",
  "Abiola Ajimobi",
  "Prakhar Singh",
  "Abdul Umar"
]


export class SeedCustomers1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const customers = dummyCustomers.map(dummyCustomer => {
      let customer = new Customer();
      customer.name = dummyCustomer;
      const customerRepository = getRepository(Customer);
      return customerRepository.save(customer);
    })
    await Promise.all(customers)
  }

  public async down(queryRunner: QueryRunner): Promise<any> { }
}
