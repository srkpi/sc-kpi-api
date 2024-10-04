import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class NoteIdDto {
  @Type(() => Number)
  @IsInt()
  noteId: number;
}
