import { applyDecorators } from '@nestjs/common';
import { Type, TypeHelpOptions } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

interface IArrayFieldOptions {
  minLength?: number;
  maxLength?: number;
  isValidateNested?: boolean;
  type?: (type?: TypeHelpOptions) => Function;
}
export function ArrayField(
  options: IArrayFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsArray({
      message: i18nValidationMessage('validation.IsArray'),
    }),
  ];

  if (options.minLength) {
    decorators.push(
      ArrayMinSize(options.minLength, {
        message: i18nValidationMessage('validation.ArrayMinSize'),
      }),
    );
  }
  if (options.maxLength) {
    decorators.push(
      ArrayMaxSize(options.maxLength, {
        message: i18nValidationMessage('validation.ArrayMaxSize'),
      }),
    );
  }
  if (options.isValidateNested) {
    decorators.push(
      ValidateNested({
        each: true,
      }),
    );
  }
  if (options.type) {
    decorators.push(Type(options.type));
  }

  return applyDecorators(...decorators);
}
