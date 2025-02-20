import { applyDecorators } from '@nestjs/common';
import { Type, TypeHelpOptions } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

interface IArrayFieldOptions {
  minLength?: number;
  maxLength?: number;
  isValidateNested?: boolean;
  enumType?: object;
  isString?: boolean;
  isNumber?: boolean;
  allowEmpty?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  type?: (type?: TypeHelpOptions) => Function;
}
export function ArrayField(
  options: IArrayFieldOptions = {},
): PropertyDecorator {
  const {
    minLength,
    maxLength,
    isValidateNested,
    type,
    enumType,
    isString,
    isNumber,
    allowEmpty = true,
  } = options;

  const decorators = [
    IsArray({
      message: i18nValidationMessage('validation.IsArray'),
    }),
  ];

  if (!allowEmpty) {
    decorators.push(
      ArrayNotEmpty({
        message: i18nValidationMessage('validation.ArrayNotEmpty'),
      }),
    );
  }

  if (minLength) {
    decorators.push(
      ArrayMinSize(minLength, {
        message: i18nValidationMessage('validation.ArrayMinSize'),
      }),
    );
  }

  if (maxLength) {
    decorators.push(
      ArrayMaxSize(maxLength, {
        message: i18nValidationMessage('validation.ArrayMaxSize'),
      }),
    );
  }

  if (enumType) {
    decorators.push(IsEnum(enumType, { each: true }));
  }

  if (isString) {
    decorators.push(IsString({ each: true }));
  }

  if (isNumber) {
    decorators.push(IsNumber({}, { each: true }));
  }

  if (isValidateNested) {
    decorators.push(
      ValidateNested({
        each: true,
      }),
    );
  }

  if (type) {
    decorators.push(Type(options.type));
  }

  return applyDecorators(...decorators);
}

export function ArrayFieldOptional(
  options?: IArrayFieldOptions,
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    ValidateIf(
      (object, value) =>
        value !== null && value !== undefined && value.length > 0,
    ),
    ArrayField({ ...options }),
  );
}
