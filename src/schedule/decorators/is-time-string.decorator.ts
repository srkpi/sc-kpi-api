import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsTimeStringValidator } from '../validators/is-time-string.validator';

export function IsTimeString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeStringValidator,
    });
  };
}
