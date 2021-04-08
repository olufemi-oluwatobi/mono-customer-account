import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { AccountType } from "../entities/accountType";


const accountTypes = [
    { name: "pounds", currency: "GBP" }, { name: "dollars", currency: "USD" }, { name: "naira", currency: "NGR" }
]
export class SeedAccountTypes1617888490663 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const types = accountTypes.map(type => {
            let accountType = new AccountType();
            accountType = Object.assign(accountType, type)
            return getRepository(AccountType).save(accountType);
        })
        await Promise.all(types)
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }
}
