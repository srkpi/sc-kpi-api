import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ScheduleDayDto } from './schedule-day.dto';
import { Type } from 'class-transformer';
import { IsCourse } from '../decorators/is-course.decorator';
import { Courses } from '../enums/courses.enum';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsCourse()
  courseIdentifier: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ScheduleDayDto)
  scheduleFirstWeek: ScheduleDayDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ScheduleDayDto)
  scheduleSecondWeek: ScheduleDayDto[];
}
