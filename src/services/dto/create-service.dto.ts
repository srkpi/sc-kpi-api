import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  buttonLink: string;
}
