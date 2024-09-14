import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsUrl()
  buttonLink: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
