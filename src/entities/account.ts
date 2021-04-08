import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
    OneToMany
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Customer, Transaction, AccountType, AccountTransaction } from "./"


@Entity()
@Unique(["number"])

export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, ({ accounts }) => accounts)
    customer: Customer;

    @OneToMany(() => Transaction, ({ sender }) => sender, { cascade: ["insert", "update"] })
    debits: Transaction[];

    @OneToMany(() => Transaction, ({ recipient }) => recipient, { cascade: ["insert", "update"] })
    credits: Transaction[];

    @ManyToOne(() => AccountType, ({ accounts }) => accounts, { cascade: ["insert", "update"] })
    @JoinColumn({ name: "accountTypeId" })
    accountType: AccountType;

    @Column()
    number: string;

    @Column({ nullable: false })
    balance: number = 0

    @OneToMany(type => AccountTransaction, ({ account }) => account)
    accountTransactions: AccountTransaction[]
}
