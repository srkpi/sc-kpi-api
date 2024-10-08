import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryIdDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
