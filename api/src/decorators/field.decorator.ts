import configs from '@configs/index';
import { applyDecorators } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsOptional,
  IsString,
  ValidateBy,
  ValidationOptions,
  ValidationArguments,
  Matches,
  IsEmail,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  Max,
  Min,
  IsArray,
  registerDecorator,
  MinDate,
  MaxDate,
  IsISO8601,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsEqualTo,
  ToArray,
  ToInt,
  ToLowerCase,
  ToUpperCase,
  Trim,
} from './transform.decorator';

interface IsDateFieldOptions {
  minDate?: Date | 'now';
  maxDate?: Date | 'now';
  smallerThan?: string;
  greaterThan?: string;
}

interface IStringFieldOptions {
  length?: number;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  toInt?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  allowEmpty?: boolean;
  email?: boolean;
  url?: boolean;
  regex?: { pattern: string | RegExp; message?: string };
  equalTo?: string;
  password?: boolean;
  passwordConfirm?: boolean;
  isStringNumber?: boolean;
  isDate?: boolean;
  dateOption?: IsDateFieldOptions;
}

interface IArrayFieldOptions {
  minLength?: number;
  maxLength?: number;
  valueType?:
    | InstanceType<typeof String>
    | InstanceType<typeof Number>
    | InstanceType<typeof Object>;
}

const configService = new ConfigService(configs());

export function StringField(
  options: IStringFieldOptions = {},
  property?: Array<string>,
  field?: string,
): PropertyDecorator {
  const decorators = [
    IsString({
      message: i18nValidationMessage('validation.IsString', {
        property: property?.[0],
      }),
    }),
    Trim(),
  ];

  if (!options.allowEmpty) {
    decorators.push(
      IsNotEmpty({
        message: i18nValidationMessage('validation.IsNotEmpty', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.length) {
    decorators.push(
      MinLength(options.length, {
        message: i18nValidationMessage('validation.MinLength', {
          count: options.length,
          property: property?.[0],
        }),
      }),
    );
    decorators.push(
      MaxLength(options.length, {
        message: i18nValidationMessage('validation.MaxLength', {
          count: options.length,
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.minLength) {
    decorators.push(
      MinLength(options.minLength, {
        message: i18nValidationMessage('validation.MinLength', {
          count: options.minLength,
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.maxLength) {
    decorators.push(
      MaxLength(options.maxLength, {
        message: i18nValidationMessage('validation.MaxLength', {
          count: options.maxLength,
          property: property?.[0],
        }),
      }),
    );
  }

  if (options.url) {
    decorators.push(
      IsUrl(undefined, {
        message: i18nValidationMessage('validation.IsUrl', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options.email) {
    decorators.push(
      IsEmail(undefined, {
        message: i18nValidationMessage('validation.IsEmail', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.regex) {
    decorators.push(
      Matches(
        typeof options?.regex.pattern === 'string'
          ? new RegExp(options?.regex.pattern)
          : options?.regex.pattern,
        {
          message:
            options.regex.message ||
            i18nValidationMessage('validation.invalid', {
              property: property?.[0],
              constraints: [property?.[1]],
            }),
        },
      ),
    );
  }

  if (options.equalTo) {
    decorators.push(
      IsEqualTo(options.equalTo, {
        message: i18nValidationMessage('validation.IsEqualTo', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options.password) {
    decorators.push(
      IsPassword({
        message: i18nValidationMessage('validation.IsPassword', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options.passwordConfirm) {
    decorators.push(
      IsMatch(field, {
        message: i18nValidationMessage('validation.IsMatch', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options?.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.max) {
    decorators.push(
      ToInt(),
      Max(options.max, {
        message: i18nValidationMessage('validation.Max', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options.min) {
    decorators.push(
      ToInt(),
      Min(options.min, {
        message: i18nValidationMessage('validation.Max', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options?.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  if (options?.toInt) {
    decorators.push(ToInt());
  }

  if (options?.isDate) {
    decorators.push(
      IsISO8601(
        { strict: true },
        {
          message: i18nValidationMessage('validation.IsDate', {
            property: property?.[0],
          }),
        },
      ),
    );
    if (options?.dateOption?.minDate) {
      if (options?.dateOption?.minDate === 'now') {
        decorators.push(
          IsFutureOrPastDate('future', {
            message: i18nValidationMessage('validation.IsFutureDate', {
              property: property?.[0],
            }),
          }),
        );
      } else if (options?.dateOption?.minDate instanceof Date) {
        console.log(options?.dateOption?.minDate);
        decorators.push(
          // Type(() => Date),
          MinDate(new Date(options?.dateOption?.minDate), {
            message: i18nValidationMessage('validation.MinDate', {
              property: property?.[0],
            }),
          }),
        );
      }
    }
    if (options?.dateOption?.maxDate) {
      if (options?.dateOption?.maxDate === 'now') {
        decorators.push(
          IsFutureOrPastDate('past', {
            message: i18nValidationMessage('validation.IsPastDate', {
              property: property?.[0],
            }),
          }),
        );
      } else if (options?.dateOption?.maxDate instanceof Date) {
        decorators.push(
          MaxDate(options?.dateOption?.maxDate, {
            message: i18nValidationMessage('validation.MaxDate', {
              property: property?.[0],
            }),
          }),
        );
      }
    }

    if (options?.dateOption?.smallerThan) {
      decorators.push(
        IsSmallerThan(options?.dateOption?.smallerThan, {
          message: i18nValidationMessage('validation.SmallerDate', {
            property: property?.[0],
            constraints: [property?.[1]],
          }),
        }),
      );
    }
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: IStringFieldOptions = {},
  property?: string,
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringField({ allowEmpty: true, ...options }, [property]),
  );
}

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsPassword',
      constraints: [
        configService.get(
          'jwt.passwordPattern',
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        ),
      ],
      validator: {
        validate(value: string, args: ValidationArguments) {
          const passwordPattern = args.constraints[0];
          if (!passwordPattern) return true;

          if (passwordPattern instanceof RegExp) {
            return passwordPattern.test(value);
          }
          const regex = new RegExp(passwordPattern);
          return regex.test(value);
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          const passwordPattern: string =
            validationArguments.constraints[0] || '';
          return `Password doesn't match with pattern ${passwordPattern}`;
        },
      },
    },
    validationOptions,
  );
}

export function IsFutureOrPastDate(
  property: 'future' | 'past',
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsFutureOrPastDate',
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [type] = args.constraints;
          const now = new Date();
          const newValue = new Date(value);
          console.log('type', type);
          if (type === 'future') {
            return newValue > now;
          }
          return newValue < now;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the future`;
        },
      },
    },
    validationOptions,
  );
}

export function IsSmallerThan(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsSmallerThan',
      constraints: [property],
      validator: {
        validate(startDate: any, args: ValidationArguments) {
          const endDate = args.object[args.constraints[0]];

          return startDate < endDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the future`;
        },
      },
    },
    validationOptions,
  );
}

export function IsMatch(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsMatch',
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];

          return value === relatedValue;
        },

        defaultMessage(): string {
          return `Confirm Password doesn't match with Password`;
        },
      },
    },
    validationOptions,
  );
}

export function EnumField<TEnum>(
  getEnum: () => TEnum,
  options: Partial<{ each: boolean }> = {},
): PropertyDecorator {
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
}

export function EnumFieldOptional<TEnum>(
  getEnum: () => TEnum,
  options: Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(IsOptional(), EnumField(getEnum, { ...options }));
}

export function ArrayField(
  options: IArrayFieldOptions = {},
  property?: Array<string>,
): PropertyDecorator {
  const decorators = [
    IsArray({
      message: i18nValidationMessage('validation.IsArray', {
        property: property?.[0],
      }),
    }),
  ];

  if (options.valueType) {
    const isValueArrayValid = function (object: object, propertyName: string) {
      registerDecorator({
        name: 'isValueArrayValid',
        target: object.constructor,
        propertyName: propertyName,
        validator: {
          validate(value: any) {
            // Check if value is an array
            if (!Array.isArray(value)) {
              return false;
            }
            // Check each item in the array
            return value.every(
              (item) => typeof item === options.valueType && item !== null,
            );
          },
          defaultMessage() {
            return `${propertyName} must be an array of ${options.valueType}`;
          },
        },
      });
    };
    decorators.push(isValueArrayValid);
  }

  return applyDecorators(...decorators);
}
