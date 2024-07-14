import { IsNotEmpty, IsUUID } from 'class-validator';

export class RecoveryDto {
  @IsNotEmpty()
  @IsUUID()
  public token: string;
}
