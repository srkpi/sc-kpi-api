import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateDepartmentDto extends PartialType(
  OmitType(CreateDepartmentDto, ['projects']),
) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
