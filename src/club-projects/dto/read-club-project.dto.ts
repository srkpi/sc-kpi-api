import { Expose } from 'class-transformer';

export class ReadClubProjectDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;
}
