import { ValidateIf } from 'class-validator';

export function ValidateMenuPrices() {
  return function (target: any, propertyKey: string) {
    ValidateIf((object: any) => {
      // Only validate menu items prices if group price is 0
      return object.price === 0;
    })(target, propertyKey);
  };
}
