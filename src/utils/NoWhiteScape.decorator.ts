import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'noWhitespace', async: false })
export class NoWhitespaceValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return true; // Không thể kiểm tra nếu không phải kiểu string
    }
    return !/\s/.test(value); // Kiểm tra xem có khoảng trắng không
  }

  defaultMessage(args: ValidationArguments) {
    return 'Username cannot contain whitespace';
  }
}

export function NoWhitespace(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoWhitespaceValidator,
    });
  };
}
