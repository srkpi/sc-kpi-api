import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsTimeString } from '../decorators/is-time-string.decorator';

export class SchedulePairDto {
  @IsOptional()
  @IsString()
  teacherName: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsTimeString()
  time: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  conferenceLink?: string;
}
