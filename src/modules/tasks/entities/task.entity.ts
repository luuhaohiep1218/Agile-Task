// src/users/entity/users.entity.ts
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity() // Declares the class as an entity
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column() // This defines `userId` as a column
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' }) // Sets up a relation with the User entity
  user: User;
}
