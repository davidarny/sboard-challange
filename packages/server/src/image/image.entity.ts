import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;

  @Column()
  path: string;

  @Column({ default: "pending" })
  status: string;

  @Column({ default: 0 })
  width: number;

  @Column({ default: 0 })
  height: number;

  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @CreateDateColumn()
  uploadedAt: Date;
}
