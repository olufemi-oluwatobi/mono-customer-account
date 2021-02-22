import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne
} from "typeorm";
import { Organisation } from "./organisation"
import { User } from "./user"



@Entity()
export class UserOrgansisation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Organisation)
    @JoinColumn()
    organisation: Organisation;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    role: string

}
