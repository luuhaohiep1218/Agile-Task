import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if the email already exists
    const isEmailExist = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isEmailExist) {
      throw new BadRequestException(
        `Email da ton tai ${createUserDto.email}.Vui long nhap 1 email khac`,
      );
    }

    // Create a new user and hash the password
    const user = new User();
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string) {
    // Check if the email already exists
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new BadRequestException('This email does not exist.');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async handleRegister(createUserDto: CreateAuthDto) {
    // Check if the email already exists
    const isEmailExist = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isEmailExist) {
      throw new BadRequestException(
        `Email da ton tai ${createUserDto.email}.Vui long nhap 1 email khac`,
      );
    }
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException(
        `Mat khau va xac nhan mat khau khong trung nhau.Vui long nhap lai`,
      );
    }

    // Create a new user and hash the password
    const user = new User();
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.save(user);
  }
}
