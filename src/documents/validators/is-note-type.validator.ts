import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { NoteTypes } from '../types/note-types.type';

@ValidatorConstraint({ name: 'isNoteType', async: false })
export class IsNoteTypeValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return NoteTypes.includes(value);
  }

  defaultMessage(): string {
  }
}
