import { IsNotEmpty, IsString } from 'class-validator';
import { IsTimeString } from '../decorators/is-time-string.decorator';

export class SchedulePairDto {
  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsTimeString()
  time: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  tag: string;
}
