import { Expose } from 'class-transformer';

export class ReadFaqDto {
  @Expose()
  id: number;

  @Expose()
  question: string;

  @Expose()
  answer: string;

  @Expose()
  category: string | null;
}
