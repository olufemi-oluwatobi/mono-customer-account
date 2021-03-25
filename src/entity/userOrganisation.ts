import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Organisation } from "./organisation"
import { v4 as uuid } from "uuid"
import { User } from "./user"



@Entity({ name: "user_organisations" })
export class UserOrgansisation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Organisation, (org) => org.id, { cascade: ["insert", "update"] })
    @JoinColumn()
    organisation: Organisation;

    @ManyToOne(() => User, (user) => user.id, { cascade: ["insert", "update"] })
    @JoinColumn()
    user: User;


    @Column()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    chatId: string

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    createUserChannelId() {
        this.chatId = `user_${uuid()}`
    }

}
