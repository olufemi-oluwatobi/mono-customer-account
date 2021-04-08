import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Account } from "./account"

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    @IsNotEmpty()
    name: string;

    @OneToMany(type => Account, ({ customer }) => customer, { cascade: ["insert", "update"] })
    accounts: Account[];

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}
