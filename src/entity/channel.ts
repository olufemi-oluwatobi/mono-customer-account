import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    BeforeInsert
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Organisation } from "./organisation"
import { ChannelMembers } from "./channelMembers"
import { v4 as uuid } from "uuid"



@Entity()

export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    description: string;

    @OneToMany(type => ChannelMembers, channelMembers => channelMembers.channel)
    channelMembers: ChannelMembers[];

    @Column()
    chatId: string;

    @ManyToOne(() => Organisation, org => org.channels)
    organisation: Organisation;


    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    createChannelChatId() {
        this.chatId = `channel_${uuid()}`
    }

}
