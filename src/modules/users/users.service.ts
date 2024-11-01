import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import aqp from 'api-query-params';

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
        `Email already exists ${createUserDto.email}.Please enter another email`,
      );
    }

    // Create a new user and hash the password
    const user = new User();
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.save(user);
  }

  async findAll(
    query: string,
    email: string,
    current: number,
    pageSize: number,
  ) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    current = current || 1;
    pageSize = pageSize || 10;

    if (typeof email !== 'undefined') {
      filter.email = ILike(`%${email}%`);
    }

    const skip = (current - 1) * pageSize;

    const [results, totalItems] = await this.userRepository.findAndCount({
      where: filter,
      take: pageSize,
      skip: skip,
      order: sort ? sort : undefined,
      select: ['id', 'email'],
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
      query,
    };
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

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: updateUserDto.email,
    });

    if (!user) {
      throw new BadRequestException('This email does not exist.');
    }

    const isPasswordMatch = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('This old password is incorrect.');
    }

    if (updateUserDto.newPassword !== undefined) {
      user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }

    try {
      const updatedUser = await this.userRepository.save(user);

      return {
        message: 'User updated successfully',
        updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findBy({
      id: id,
    });

    if (!user) {
      throw new BadRequestException('This user does not exist.');
    }
    return this.userRepository.delete(id);
  }

  async handleRegister(createUserDto: CreateAuthDto) {
    // Check if the email already exists
    const isEmailExist = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isEmailExist) {
      throw new BadRequestException(
        `Email already exists ${createUserDto.email}.Please enter another email`,
      );
    }
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException(
        `Password and confirm password do not match. Please re-enter.`,
      );
    }

    // Create a new user and hash the password
    const user = new User();
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.save(user);
  }
}
