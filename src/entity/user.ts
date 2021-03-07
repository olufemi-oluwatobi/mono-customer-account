import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { UserOrgansisation } from "./userOrganisation"
import { ChannelMembers } from "./channelMembers"
import { Profile } from "./profile"
import { Channel } from ".";


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

  @Column({ select: true })
  @Length(4, 100)
  password: string;

  @Column()
  isActive: boolean = false

  @Column()
  @IsNotEmpty()
  role: string;

  @OneToMany(type => UserOrgansisation, userOrg => userOrg.organisation)
  userOrganisation: UserOrgansisation[];

  @OneToMany(type => ChannelMembers, (d) => d.user)
  channels: ChannelMembers[];

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

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
