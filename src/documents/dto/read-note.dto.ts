import { Expose } from 'class-transformer';

export class ReadNoteDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
