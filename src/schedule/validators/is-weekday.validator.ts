import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Weekdays } from '../enums/weekdays.enum';

@ValidatorConstraint({ name: 'isWeekday', async: false })
export class IsWeekdayValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return Object.keys(Weekdays).includes(value);
  }

  defaultMessage(): string {
    return 'The value must be a valid weekday abbreviation!';
  }
}
