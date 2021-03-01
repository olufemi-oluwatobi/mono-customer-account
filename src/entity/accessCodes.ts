import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Organisation } from "./organisation";

@Entity()
export class AccessCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  userId: string;

  @Column()
  code: number;
}
