import { Expose } from 'class-transformer';

export class ReadCalendarEventDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  shortDescription: string;

  @Expose()
  location: string;

  @Expose()
  tag: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;
}
