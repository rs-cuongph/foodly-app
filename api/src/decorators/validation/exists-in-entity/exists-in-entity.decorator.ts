import { registerDecorator, ValidationOptions } from 'class-validator';
import { ExistsInEntityConstraint } from './exists-in-entity.validator';

interface ExistsInEntityOptions {
  entity: string;
  property: string;
}

export function ExistsInEntity(
  options: ExistsInEntityOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ExistsInEntity',
      target: object.constructor, // Target class
      propertyName: propertyName, // Property name
      options: validationOptions,
      validator: ExistsInEntityConstraint,
      constraints: [options.entity, options.property],
    });
  };
}
