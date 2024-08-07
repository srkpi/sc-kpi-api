import { Expose } from 'class-transformer';

export class AuthUrlDto {
  @Expose()
  authUrl: string;
}
