import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { AccountType, AccountTransaction } from ".";
import { Account } from "./account";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Account, ({ debits }) => debits)
    @JoinColumn({ name: "senderId" })
    sender: Account;

    @ManyToOne(type => Account, ({ credits }) => credits)
    @JoinColumn({ name: "recipientId" })
    recipient: Account;

    @Column()
    amount: number;

    @OneToMany(type => AccountTransaction, ({ transaction }) => transaction)
    accountTransaction: AccountTransaction

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}
