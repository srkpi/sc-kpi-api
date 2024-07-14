import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRecoveryDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
