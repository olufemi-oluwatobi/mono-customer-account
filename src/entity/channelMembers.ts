import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany
} from "typeorm";
import { Channel } from "./channel"
import { User } from "./user"



@Entity({ name: "channel_members" })
export class ChannelMembers {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => User, (user) => user.id, { cascade: ["insert", "update"] })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Channel, (channel) => channel.id, { cascade: ["insert", "update"] })
    @JoinColumn()
    channel: Channel;

    @Column()
    chatId: string

    @Column()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}
