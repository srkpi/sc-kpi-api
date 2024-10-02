import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
