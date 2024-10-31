// src/users/entity/users.entity.ts
import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

  @Column()
  isCompleted: boolean;
}
