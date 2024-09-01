import { IsEnum, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ToArray } from './transform.decorator';
import { applyDecorators } from '@nestjs/common';

export const EnumField = <TEnum>(
  getEnum: () => TEnum,
  options: Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  const enumValue = getEnum() as unknown;
  const decorators = [
    IsEnum(enumValue as object, {
      each: options?.each,
      message: i18nValidationMessage('validation.IsEnum', {
        enum: Object.values(enumValue),
      }),
    }),
  ];

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
};

export const EnumFieldOptional = <TEnum>(
  getEnum: () => TEnum,
  options: Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  return applyDecorators(IsOptional(), EnumField(getEnum, { ...options }));
};
