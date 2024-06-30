import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateClubDto } from './create-club.dto';

export class UpdateClubDto extends PartialType(CreateClubDto) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
