import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Image } from "../image/image.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];
}
