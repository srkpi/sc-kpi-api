import { IntersectionType } from '@nestjs/swagger';
import { GreetingResponseCreationDto } from './greeting-response-creation.dto';

export class GreetingResponseInfoDto extends IntersectionType(
  GreetingResponseCreationDto,
) {}
