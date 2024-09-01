import { applyDecorators } from '@nestjs/common';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { isNil } from 'lodash';
import { i18nValidationMessage } from 'nestjs-i18n';

interface INumberFieldOptions {
  isInt?: boolean;
  isFloat?: boolean;
  max?: number;
  min?: number;
  allowNaN?: boolean;
  allowInfinity?: boolean;
  maxDecimalPlaces?: number;
}

export const NumberField = (options: INumberFieldOptions = {}) => {
  const { min, max } = options;
  const decorators = [
    IsNumber(
      {
        allowNaN: options?.allowNaN,
        allowInfinity: options?.allowInfinity,
        maxDecimalPlaces: options?.maxDecimalPlaces,
      },
      {
        message: i18nValidationMessage('validation.IsNumber'),
      },
    ),
  ];

  if (!isNil(min)) {
    decorators.push(Min(min));
  }

  if (!isNil(max)) {
    decorators.push(Max(max));
  }

  return applyDecorators(...decorators);
};

export const NumberFieldOptional = (options: INumberFieldOptions = {}) => {
  const decorators = [IsOptional(), NumberField(options)];

  return applyDecorators(...decorators);
};
