import { applyDecorators } from '@nestjs/common';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateBy,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsEqualTo,
  ToInt,
  ToLowerCase,
  ToNumber,
  ToUpperCase,
  Trim,
} from './transform.decorator';
import * as ValidatorJS from 'validator';
import { ConfigService } from '@nestjs/config';
import configs from '@configs/index';
import type { ValidationArguments, ValidationOptions } from 'class-validator';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { REGEX_VALIDATE } from '@constants/validation.constant';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const configService = new ConfigService(configs());

interface DateOptions {
  dateStringOptions?: ValidatorJS.IsISO8601Options;
  minDate?: string | Date | (() => Date);
  maxDate?: string | Date | (() => Date);
}

interface TransformOptions {
  toInt?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

interface IStringFieldOptions {
  property?: string; // property name
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  url?: boolean;
  isPassword?: boolean;
  isPhone?: boolean;
  noEmoji?: boolean;
  allowEmpty?: boolean;
  equalTo?: string;
  sameAs?: string;
  password?: boolean;
  isIdentifyNumber?: boolean;
  isDate?: boolean;
  isStringNumber?: boolean;
  isInt?: boolean;
  isFloat?: boolean;
  min?: number;
  max?: number;
  transformTo?: boolean;
  // options validate
  transformOptions?: TransformOptions;
  dateOptions?: DateOptions;
  emailOptions?: ValidatorJS.IsEmailOptions;
  urlOptions?: ValidatorJS.IsURLOptions;
  numericOptions?: ValidatorJS.IsNumericOptions;
}

const IsPassword = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsPassword',
      constraints: [
        configService.get(
          'jwt.passwordPattern',
          // Mẫu regex này đảm bảo mật khẩu phải:
          // - Có ít nhất 1 chữ hoa (?=.*?[A-Z])
          // - Có ít nhất 1 chữ thường (?=.*?[a-z])
          // - Có ít nhất 1 số (?=.*?[0-9])
          // - Có ít nhất 1 ký tự đặc biệt (?=.*?[#?!@$%^&*-])
          // - Độ dài tối thiểu 8 ký tự (.{8,})
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
      },
    },
    validationOptions,
  );
};

const IsIdentifyNumber = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsIdentifyNumber',
      constraints: [],
      validator: {
        validate(value: string) {
          const regex = new RegExp(REGEX_VALIDATE.IS_IDENTIFY_NUMBER);
          return regex.test(value);
        },
      },
    },
    validationOptions,
  );

const IsNotEmoji = (validationOptions?: ValidationOptions): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsNotEmoji',
      constraints: [],
      validator: {
        validate(value: string) {
          const regexEmoji = new RegExp(REGEX_VALIDATE.EMOJI);
          return !regexEmoji.test(value);
        },
      },
    },
    validationOptions,
  );

const MinDateString = (
  property: string | Date | (() => Date),
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'MinDateString',
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const targetKey = args.constraints[0];
          const payload = args.object;
          if (typeof property === 'string') {
            const targetValue = payload[targetKey];
            return dayjs(value).isSameOrAfter(dayjs(targetValue));
          }
          return false;
        },
        defaultMessage: (args: ValidationArguments) => {
          const targetKey = args.constraints[0];
          const payload = args.object;
          return i18nValidationMessage('validation.MinDate', {
            property: args.property,
            min: payload[targetKey],
          })(args);
        },
      },
    },
    validationOptions,
  );
};

const MaxDateString = (
  property: string | Date | (() => Date),
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'MaxDateString',
      constraints: [property],
      validator: {
        validate(value: string, args: ValidationArguments) {
          console.log(args);
          const targetKey = args.constraints[0];
          const payload = args.object;

          if (typeof property === 'string') {
            const targetValue = payload[targetKey];
            return dayjs(value).isSameOrBefore(dayjs(targetValue));
          }
          args.constraints[0] = 'xxxx';
          return false;
        },
        defaultMessage: (args: ValidationArguments) => {
          const targetKey = args.constraints[0];
          const payload = args.object;
          return i18nValidationMessage('validation.MaxDate', {
            property: args.property,
            max: payload[targetKey],
          })(args);
        },
      },
    },
    validationOptions,
  );
};

const IsMatch = (
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
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
      },
    },
    validationOptions,
  );
};

export function StringField(
  options?: IStringFieldOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  const {
    allowEmpty,
    email,
    url,
    noEmoji,
    emailOptions = {},
    urlOptions = {},
    equalTo,
    sameAs,
    password,
    isIdentifyNumber,
    isDate,
    dateOptions,
    isStringNumber,
    transformTo,
    transformOptions,
    min,
    max,
    numericOptions,
    minLength,
    maxLength,
    property,
  } = options ?? {};

  const decorators = [
    IsString({
      message:
        validationOptions?.message ??
        i18nValidationMessage('validation.IsString'),
    }),
    Trim(),
  ];

  if (!allowEmpty) {
    decorators.push(
      IsNotEmpty({
        message:
          validationOptions?.message ??
          i18nValidationMessage('validation.IsNotEmpty'),
      }),
    );
  }
  if (isStringNumber) {
    decorators.push(
      IsNumberString(numericOptions ?? {}, {
        message: i18nValidationMessage('validation.IsNumber'),
      }),
    );
  }

  if (transformTo) {
    if (transformOptions.toLowerCase) {
      decorators.push(ToLowerCase());
    } else if (transformOptions.toUpperCase) {
      decorators.push(ToUpperCase());
    } else if (transformOptions.toInt) {
      decorators.push(ToInt());
    }
  }

  if (noEmoji) {
    decorators.push(
      IsNotEmoji({
        message:
          validationOptions?.message ??
          i18nValidationMessage('validation.NoEmoji'),
      }),
    );
  }

  if (email) {
    decorators.push(
      IsEmail(emailOptions, {
        message:
          validationOptions?.message ??
          i18nValidationMessage('validation.IsEmail'),
      }),
    );
  }

  if (url) {
    decorators.push(
      IsUrl(urlOptions, {
        message:
          validationOptions?.message ??
          i18nValidationMessage('validation.IsUrl'),
      }),
    );
  }

  if (equalTo) {
    decorators.push(
      IsEqualTo(equalTo, {
        message:
          validationOptions?.message ??
          i18nValidationMessage('validation.IsEqualTo'),
      }),
    );
  }

  if (sameAs) {
    decorators.push(
      IsMatch(sameAs, {
        message:
          validationOptions?.message ??
          i18nValidationMessage('validation.IsMatch'),
      }),
    );
  }

  if (password) {
    decorators.push(
      IsPassword({
        message: i18nValidationMessage('validation.IsPassword'),
      }),
    );
  }

  if (minLength) {
    decorators.push(
      MinLength(minLength, {
        message: i18nValidationMessage('validation.MinLength', {
          property: property ?? '',
        }),
      }),
    );
  }

  if (maxLength) {
    decorators.push(
      MaxLength(maxLength, {
        message: i18nValidationMessage('validation.MaxLength', {
          // property: property
          //   ? i18nValidationMessage(`validation-properties.${property}`)
          //   : '',
          property: property ?? '',
        }),
      }),
    );
  }

  if (isIdentifyNumber) {
    decorators.push(
      IsIdentifyNumber({
        message: i18nValidationMessage('validation.IsIdentifyNumber'),
      }),
    );
  }

  if (isDate) {
    decorators.push(
      IsDateString(dateOptions?.dateStringOptions ?? {}, {
        message: i18nValidationMessage('validation.IsDateString'),
      }),
    );

    if (dateOptions?.minDate) {
      decorators.push(MinDateString(dateOptions.minDate));
    }

    if (dateOptions?.maxDate) {
      decorators.push(MaxDateString(dateOptions.maxDate));
    }
  }

  if (isStringNumber) {
    if (min) {
      decorators.push(
        ToNumber(),
        Min(options.min, {
          message: i18nValidationMessage('validation.Min'),
        }),
      );
    }

    if (max) {
      decorators.push(
        ToNumber(),
        Max(options.max, {
          message: i18nValidationMessage('validation.Max'),
        }),
      );
    }
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options?: IStringFieldOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringField({ allowEmpty: true, ...options }, validationOptions),
  );
}
