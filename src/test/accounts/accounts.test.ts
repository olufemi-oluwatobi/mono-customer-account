import 'module-alias/register';
import { Account, Customer } from '../../entities';
// import * as supertest from "supertest"
import { assert, expect } from 'chai';
// import { Account, AccountTransaction, Customer } from "../../entities"

import { container, Types } from "../../config/di/container"
import { AccountRepository, CustomerRepository } from "../../config/interfaces"
import { TestFactory } from "../factory";

const accountRepo = container.get<AccountRepository>(Types.AccountRepository)
const customerRepo = container.get<CustomerRepository>(Types.CustomerRepository)


describe("Testing Creation Account Features", () => {
    const factory: TestFactory = new TestFactory()
    beforeAll(async () => {
        await factory.init()
    })

    afterAll(async () => {
        await factory.close()
    })

    test("respond with 400 if body is empty", (done) => {
        factory.app.post("/account").send().set("Accept", "application/json").expect("Content-Type", /json/).expect(400, done)
    })

    test("should return 400 if initialDeposit is missing", async (done) => {
        factory.app.post("/account").send({ customerId: 1, type: "naira" }).set("Accept", "application/json").expect("Content-Type", /json/).expect(400, done)
    })

    test("Customer should exit in database", async (done) => {
        const customer = await customerRepo.findCustomer({ id: 1 })
        assert.instanceOf(customer, Customer)
        done()
    })

    test("should return 201", async (done) => {
        factory.app.post("/account").send({ customerId: 1, type: "naira", initialDeposit: 1000 }).set("Accept", "application/json").expect("Content-Type", /json/).expect(201, done)
    })

    test("Should return 404 if user param is missing", (done) => {
        factory.app.get("/account/balance").send().expect(404, done)
    })


})

