import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsNoteTypeValidator } from '../validators/is-note-type.validator';

export function IsNoteType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNoteTypeValidator,
    });
  };
}
