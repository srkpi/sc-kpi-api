import { SchedulePairDto } from './schedule-pair.dto';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsWeekday } from '../decorators/is-weekday.decorator';

export class ScheduleDayDto {
  @IsString()
  @IsWeekday()
  day: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SchedulePairDto)
  pairs: SchedulePairDto[];
}
