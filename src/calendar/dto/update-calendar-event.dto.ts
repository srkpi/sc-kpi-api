import { IsInt, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateCalendarEventDto } from './create-calendar-event.dto';

export class UpdateCalendarEventDto extends PartialType(
  CreateCalendarEventDto,
) {
  @IsNumber()
  @IsInt()
  id: number;
}
