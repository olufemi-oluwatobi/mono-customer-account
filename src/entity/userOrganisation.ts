import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Organisation } from "./organisation"
import { User } from "./user"



@Entity({ name: "user_organisations" })
export class UserOrgansisation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Organisation)
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
    @UpdateDateColumn()
    updatedAt: Date;

}
