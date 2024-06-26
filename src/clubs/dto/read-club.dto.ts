import { Expose, Type } from 'class-transformer';
import { ReadClubProjectDto } from '../../club-projects/dto/read-club-project.dto';

export class ReadClubDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => ReadClubProjectDto)
  projects: ReadClubProjectDto[];
}
