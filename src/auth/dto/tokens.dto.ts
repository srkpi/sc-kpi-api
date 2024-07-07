import { Expose } from 'class-transformer';

export class TokensDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
