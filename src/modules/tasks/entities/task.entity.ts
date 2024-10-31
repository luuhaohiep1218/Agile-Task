// src/users/entity/users.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity() // Declares the class as an entity
export class Task {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  isCompleted: boolean;
}
