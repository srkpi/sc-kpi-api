import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTimeString', async: false })
export class IsTimeStringValidator implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    return (
      typeof time === 'string' &&
      /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
    );
  }

  defaultMessage(): string {
    return 'Time must be in the format H:MM or HH:MM!';
  }
}
