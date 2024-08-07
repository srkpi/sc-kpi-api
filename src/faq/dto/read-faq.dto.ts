import { Expose, Type } from 'class-transformer';
import { ReadCategoryDto } from '../categories/dto/read-category.dto';

export class ReadFaqDto {
  @Expose()
  id: number;

  @Expose()
  question: string;

  @Expose()
  answer: string;

  @Expose()
  categoryId: number | null;

  @Expose()
  @Type(() => ReadCategoryDto)
  category: ReadCategoryDto | null;
}
