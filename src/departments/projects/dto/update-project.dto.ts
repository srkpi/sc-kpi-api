import { IsInt } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateProjectDto extends OmitType(CreateProjectDto, [
  'departmentId',
] as const) {
  @IsInt()
  id: number;
}
