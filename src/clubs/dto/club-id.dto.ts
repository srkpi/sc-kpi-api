import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ClubIdDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
