import { OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateFaqDto } from './create-faq.dto';

export class UpdateFaqDto extends PartialType(
  OmitType(CreateFaqDto, ['categoryId']),
) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
