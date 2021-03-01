import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    ManyToMany
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Organisation } from "./organisation"
import { User } from "./user"



@Entity()

export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    description: string;

    @Column()
    @Length(4, 100)
    isPrivate: string;

    @Column()
    @IsNotEmpty()
    role: string;


    @ManyToOne(() => Organisation, org => org.channels)
    organisation: Organisation;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}
