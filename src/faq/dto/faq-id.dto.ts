import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FaqIdDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
