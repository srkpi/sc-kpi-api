import { Expose } from 'class-transformer';

export class ReadCategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
