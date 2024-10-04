import { OmitType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto';

export class UpdateUserDto extends OmitType(RegisterDto, [
  'email',
  'password',
] as const) {}
