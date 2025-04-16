import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/**
 * Decorator for menu_items array in group DTO
 * Skip validation of the whole array if group price is not 0
 */
export function ValidateMenuPrices() {
  return function (target: any, propertyKey: string) {
    ValidateIf((object: any) => {
      // Only validate menu items if group price is 0
      return object.price === 0;
    })(target, propertyKey);
  };
}

/**
 * Decorator for price field in menu DTO
 * Skip validation of the price field if parent group has non-zero price
 * @param validationOptions
 */
export function ValidateMenuItemPrice(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateMenuItemPrice',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;

          // Try to find parent context or skip validation
          try {
            // Get parent object if available
            const parent = obj.__parent__;

            // If parent exists and has non-zero price, skip validation
            if (parent && parent.price !== 0) {
              return true; // Skip validation
            }
          } catch (e) {
            // If we can't get parent, assume we need to validate
          }

          // If no parent with price, validate normally
          // Basic check: price should be between 1000 and 10000000
          return value >= 1000 && value <= 10000000;
        },
        defaultMessage(args: ValidationArguments) {
          return i18nValidationMessage('validation.PriceRange', {
            property: args.property,
            min: 1000,
            max: 10000000,
          })(args);
        },
      },
    });
  };
}
