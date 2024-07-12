import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Courses } from '../enums/courses.enum';
import { Weekdays } from '../enums/weekdays.enum';

@ValidatorConstraint({ name: 'isCourse', async: false })
export class IsCourseValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return Object.keys(Courses).includes(value);
  }

  defaultMessage(): string {
    return 'The value must be a valid course identifier: 1-3, 5 курси; 4 курс; 6 курс ОНП';
  }
}
