import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CreateGreetingDto } from './create-greeting.dto';
import { GreetingIdDto } from './greeting-id.dto';

export class UpdateGreetingDto extends IntersectionType(
  PartialType(CreateGreetingDto),
  GreetingIdDto,
) {}
