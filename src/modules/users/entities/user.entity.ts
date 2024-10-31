import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
}
