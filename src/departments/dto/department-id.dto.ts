import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DepartmentIdDto {
  @Type(() => Number)
  @IsInt()
  departmentId: number;
}
