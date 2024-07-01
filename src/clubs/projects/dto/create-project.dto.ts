import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;
}
