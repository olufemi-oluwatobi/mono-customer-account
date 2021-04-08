import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Transaction } from "./"
import { Account } from "./account"

@Entity()
export class AccountTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Transaction, ({ accountTransaction }) => accountTransaction)
    @JoinColumn({ name: "transactionId" })
    transaction: Transaction;

    @ManyToOne(() => Account, ({ accountTransactions }) => accountTransactions)
    @JoinColumn({ name: "accountId" })
    account: Account;

    @Column()
    balanceAsAtTransaction: number;

    @Column({
        type: "enum", enum: [
            "debit", "credit"
        ]
    })
    transactionType: string;


    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
