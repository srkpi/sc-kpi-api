import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsISO8601({ strict: true, strictSeparator: true })
  startDate: string;

  @IsISO8601({ strict: true, strictSeparator: true })
  endDate: string;
}
