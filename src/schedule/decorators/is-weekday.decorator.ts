import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsWeekdayValidator } from '../validators/is-weekday.validator';

export function IsWeekday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWeekdayValidator,
    });
  };
}
