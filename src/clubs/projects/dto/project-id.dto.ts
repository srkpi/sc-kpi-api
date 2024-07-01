import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ProjectIdDto {
  @Type(() => Number)
  @IsInt()
  projectId: number;
}
