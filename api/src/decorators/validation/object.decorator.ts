import { applyDecorators } from '@nestjs/common';
import { IsObject, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const ObjectField = (property?: string) => {
  return applyDecorators(
    IsObject({
      message: i18nValidationMessage('validation.IsObject'),
    }),
  );
};

export const ObjectFieldOptional = (property?: string) => {
  return applyDecorators(
    IsOptional(),
    IsObject({
      message: i18nValidationMessage('validation.IsObject', {
        property: property,
      }),
    }),
  );
};
