import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    Unique,
    OneToMany
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Account } from "./account"


@Entity()

export class AccountType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: false })
    currency: string

    @OneToMany(type => Account, ({ accountType }) => accountType, { cascade: ["insert", "update"] })
    accounts: Account[];

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}
