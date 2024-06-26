import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ClubProjectIdDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
