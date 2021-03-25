import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany
} from "typeorm";
import { Channel } from "./channel"
import { User } from "./user"
import { UserOrgansisation, Organisation } from "./"



@Entity({ name: "messages" })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timetoken: string

    @ManyToOne(() => Organisation, (org) => org.id, { cascade: ["insert", "update"] })
    @JoinColumn()
    organisation: Organisation;

    @ManyToOne(() => User, (user) => user.id, { cascade: ["insert", "update"] })
    @JoinColumn()
    sender: User;

    @Column()
    reciepientId: string;

    @Column()
    chatRoomType: "direct_message" | "channel" | "support"

    @Column()
    timestamp: string

    @Column()
    text: string

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}
