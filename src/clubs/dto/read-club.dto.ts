import { Expose, Type } from 'class-transformer';
import { ReadProjectDto } from '../projects/dto/read-project.dto';
export class ReadClubDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  shortDescription: string;

  @Expose()
  image: string;

  @Expose()
  buttonLink: string;

  @Expose()
  category: string;

  @Expose()
  @Type(() => ReadProjectDto)
  projects: ReadProjectDto[];
}
