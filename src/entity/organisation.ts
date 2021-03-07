import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    BeforeInsert
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { UserOrgansisation } from "./userOrganisation"
import { Channel } from "./channel";
import slugify from "slugify"

@Entity()
@Unique(["slug", "name"])

export class Organisation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1, 30)
    name: string

    @Column()
    slug: string

    @OneToMany(type => UserOrgansisation, userOrg => userOrg.user)
    userOrganisation: UserOrgansisation[];

    @OneToMany(() => Channel, channel => channel.organisation)
    channels: Channel[]

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    createSlug() {
        let name = this.name
        name = name.replace(/-/g, ' ');

        this.slug = slugify(name, {
            replacement: "_",
            lower: true
        })
    }

}