import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  projects: Omit<CreateProjectDto, 'clubId'>[];
}
