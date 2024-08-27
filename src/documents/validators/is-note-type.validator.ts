import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { NoteTypes } from '../types/note-types.type';

@ValidatorConstraint({ name: 'isNoteType', async: false })
export class IsNoteTypeValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return NoteTypes.includes(value);
  }

  defaultMessage(): string {
    return 'The value must be a valid note type: СЛУЖБОВА ЗАПИСКА, ПОДАННЯ, ЗВЕРНЕННЯ';
  }
}
