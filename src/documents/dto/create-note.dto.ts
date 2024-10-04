import { IsNotEmpty, IsString } from 'class-validator';
import { IsNoteType } from '../decorators/is-note-type.decorator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @IsNoteType()
  type: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
