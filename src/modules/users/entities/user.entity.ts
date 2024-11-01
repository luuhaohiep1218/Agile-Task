import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Task } from 'src/modules/tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Email format is invalid' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @Column()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
