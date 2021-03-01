import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    ManyToMany,
    OneToMany
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { User } from "./user"
import { Channel } from "./channel";

@Entity()
@Unique(["customer_chat_url", "name"])

export class Organisation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string

    @Column()
    customer_chat_url: string


    @ManyToMany(() => User, user => user.organisations)
    @JoinTable()
    user: User[];


    @OneToMany(() => Channel, channel => channel.organisation)
    channels: Channel[]

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}