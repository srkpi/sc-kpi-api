import { PartialType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsInt()
  id: number;
}
