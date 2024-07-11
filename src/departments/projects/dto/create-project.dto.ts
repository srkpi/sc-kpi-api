import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsInt()
  departmentId: number;

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
