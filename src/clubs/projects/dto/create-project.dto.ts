import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsInt()
  @IsNotEmpty()
  clubId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
