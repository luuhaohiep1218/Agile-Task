import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  isCompleted: boolean;
}
