import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ServiceIdDto {
  @Type(() => Number)
  @IsInt()
  serviceId: number;
}
