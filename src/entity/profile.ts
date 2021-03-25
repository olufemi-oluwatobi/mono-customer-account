import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Organisation } from "./organisation"
import { Channel } from "./channel"
import { User } from "./user"


@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstname: string;

    @Column()
    @Length(3, 30)
    lastName: string

    @Column({ nullable: true })
    @Length(3, 100)
    avatarUrl: string

    @Column({ select: false })
    @Length(4, 100)
    phoneNumber: string;

    @Column()
    timezone: string

    @Column({ nullable: true })
    @IsNotEmpty()
    bio: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;


}
