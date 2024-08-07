import { Expose } from 'class-transformer';

export class AtResponseDto {
  @Expose()
  accessToken: string;
}
