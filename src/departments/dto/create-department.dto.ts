import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsUrl()
  buttonLink: string;

  @IsOptional()
  @IsArray()
  projects: CreateDepartmentProjectDto[];
}

class CreateDepartmentProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;
}
