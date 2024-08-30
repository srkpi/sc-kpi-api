import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CalendarEventIdDto {
  @Type(() => Number)
  @IsInt()
  calendarEventId: number;
}
