// src/users/entity/users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Declares the class as an entity
export class User {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
