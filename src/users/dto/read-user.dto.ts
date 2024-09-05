import { Expose } from 'class-transformer';

export class ReadUserDto {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  middleName?: string;

  @Expose()
  faculty: string;

  @Expose()
  group: string;

  @Expose()
  createdAt: string;
}
