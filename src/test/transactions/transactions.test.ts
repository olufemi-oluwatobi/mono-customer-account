import 'module-alias/register';
import { Account, Customer } from '../../entities';
import { assert, expect } from 'chai';
// import { Account, AccountTransaction, Customer } from "../../entities"

import { container, Types } from "../../config/di/container"
import { AccountRepository, CustomerRepository } from "../../config/interfaces"
import { TestFactory } from "../factory";

const accountRepo = container.get<AccountRepository>(Types.AccountRepository)


describe("Testing Transaction Features", () => {
    const factory: TestFactory = new TestFactory()
    beforeAll(async () => {
        await factory.init()
    })

    afterAll(async () => {
        await factory.close()
    })


    test("account should have at least 2 records", async (done) => {
        const sender = await accountRepo.findAccount({ id: 1 })
        const reciever = await accountRepo.findAccount({ id: 2 })
        assert.instanceOf(sender, Account)
        assert.instanceOf(reciever, Account)
        done()
    })
    test("respond with 400 if body is empty", (done) => {
        factory.app.post("/transaction").send().set("Accept", "application/json").expect("Content-Type", /json/).expect(400, done)
    })

    test("return 201 when transaction is successful", async (done) => {
        const sender = await accountRepo.findAccount({ id: 1 })
        factory.app.post("/transaction").send({ senderAccountId: 1, recipientAccountId: 2, amount: 200, currency: "NGR" }).set("Accept", "application/json").expect("Content-Type", /json/).expect(201, done)
    })

    test("return 400 when account balance is lower than amount", async (done) => {
        factory.app.post("/transaction").send({ senderAccountId: 1, recipientAccountId: 2, amount: 300000000, currency: "NGR" }).set("Accept", "application/json").expect("Content-Type", /json/).expect(201, done)
    })

})

