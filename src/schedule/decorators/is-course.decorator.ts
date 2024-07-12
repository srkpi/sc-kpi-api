import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsCourseValidator } from '../validators/is-course.validator';

export function IsCourse(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCourseValidator,
    });
  };
}
