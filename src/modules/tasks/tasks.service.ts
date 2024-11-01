import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, userId } = createTaskDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not available in system');
    }
    const task = new Task();
    task.title = title;
    task.userId = userId;
    return await this.taskRepository.save(task);
  }

  async findAll(
    query: string,
    isCompleted?: boolean,
    userId?: number,
    current?: number,
    pageSize?: number,
  ) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    current = current || 1;
    pageSize = pageSize || 10;

    if (userId) {
      filter.userId = userId;
    }

    if (typeof isCompleted !== 'undefined') {
      filter.isCompleted = isCompleted;
    }

    const skip = (current - 1) * pageSize;

    const [results, totalItems] = await this.taskRepository.findAndCount({
      where: filter,
      take: pageSize,
      skip: skip,
      order: sort ? sort : undefined,
      select: ['id', 'title', 'createdAt', 'isCompleted'],
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

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(updateTaskDto: UpdateTaskDto) {
    const { id, title, isCompleted } = updateTaskDto;

    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new BadRequestException('Task not available in system');
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (isCompleted !== undefined) {
      if (typeof isCompleted === 'string') {
        task.isCompleted = isCompleted === 'true';
      } else {
        task.isCompleted = Boolean(isCompleted);
      }
    }

    try {
      const updatedTask = await this.taskRepository.save(task);

      return {
        message: 'Task updated successfully',
        updatedTask,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async remove(id: number) {
    const task = await this.taskRepository.delete(id);
    if (!task) {
      throw new BadRequestException('Task not available in system');
    }
    return { message: 'Task delete successfully', task };
  }
}
