import { IsInt } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateProjectDto extends OmitType(CreateProjectDto, [
  'clubId',
] as const) {
  @IsInt()
  id: number;
}
