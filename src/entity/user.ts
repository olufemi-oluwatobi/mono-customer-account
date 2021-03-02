import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Organisation } from "./organisation"
import { Channel } from "./channel"



@Entity()
@Unique(["username", "email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column()
  @Length(3, 30)
  email: string

  @Column({ select: false })
  @Length(4, 100)
  password: string;

  @Column()
  isActive: boolean = false

  @Column()
  @IsNotEmpty()
  role: string;

  @OneToMany(() => Organisation, organisation => organisation.user)
  organisations: Organisation[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    console.log(this)
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
