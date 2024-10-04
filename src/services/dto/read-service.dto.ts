import { Expose } from 'class-transformer';

export class ReadServiceDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;

  @Expose()
  buttonLink: string;
}
