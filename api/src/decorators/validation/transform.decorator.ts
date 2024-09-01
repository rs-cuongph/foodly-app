/* eslint-disable complexity */
import { Transform } from 'class-transformer';
import { registerDecorator, ValidateBy } from 'class-validator';
import type { ValidationArguments, ValidationOptions } from 'class-validator';
import * as dayjs from 'dayjs';
import { isArray, isNil, map, trim, castArray } from 'lodash';
import { isFile } from 'nestjs-form-data';

export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replace(/\s\s+/g, ' '));
    }

    return trim(value).replace(/\s\s+/g, ' ');
  });
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return params.value;
      }
    },
    { toClassOnly: true },
  );
}

export function ToDate(): PropertyDecorator {
  return Transform(
    (params) => {
      return dayjs(params.value).format('YYYY-MM-DD');
    },
    { toClassOnly: true },
  );
}

export function ToDateISOString(): PropertyDecorator {
  return Transform(
    (params) => {
      return dayjs(params.value).toISOString();
    },
    { toClassOnly: true },
  );
}

export function ToInt(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string;
      return Number.parseInt(value, 10);
    },
    { toClassOnly: true },
  );
}

export function ToNumber(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string;

      return Number(value);
    },
    { toClassOnly: true },
  );
}

export function ToFloat(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string;
      return Number.parseFloat(value);
    },
    { toClassOnly: true },
  );
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toLowerCase();
      }

      return value.map((v) => v.toLowerCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toUpperCase();
      }

      return value.map((v) => v.toUpperCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function ToArray(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (isNil(value)) {
        return [];
      }

      return castArray(value);
    },
    { toClassOnly: true },
  );
}

export function IsEqualTo<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}

type FileSystemStoredFileCustom = {
  originalName: string;
  encoding: string;
  busBoyMimeType: string;
  path: string;
  size: number;
  fileType: {
    ext: string;
    mime: string;
  };
};

export function HasMimeType(
  allowedMimeTypes: string[] | string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'HasMimeType',
      constraints: [allowedMimeTypes],
      validator: {
        validate(value: FileSystemStoredFileCustom, args: ValidationArguments) {
          const allowedMimeTypes: string[] = args.constraints[0];
          if (isFile(value)) {
            return allowedMimeTypes.some((mime) =>
              value.busBoyMimeType.includes(mime),
            );
          }
          return false;
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          const allowedMimeTypes: string[] =
            validationArguments.constraints[0] || [];
          return `File must be of one of the types ${allowedMimeTypes.join(', ')}`;
        },
      },
    },
    validationOptions,
  );
}
