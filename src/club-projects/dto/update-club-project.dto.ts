import { PartialType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateClubProjectDto } from './create-club-project.dto';

export class UpdateClubProjectDto extends PartialType(CreateClubProjectDto) {
  @IsInt()
  id: number;
}
