import * as yup from 'yup';

import { REGEX_VALIDATE } from './regex-validate';

// This function creates a Yup schema with i18n support
export const createI18nYupSchema = (t: any) => {
  // Set up custom locale for Yup
  const locale = {
    mixed: {
      required: ({ label }: { label: string }) => {
        return t('validation.required', {
          field: t(`validation.fields.${label}`),
        });
      },
    },
    string: {
      email: ({ label }: { label: string }) => {
        return t('validation.email', {
          field: t(`validation.fields.${label}`),
        });
      },
      min: ({ label, min }: { label: string; min: number }) => {
        return t('validation.min', {
          field: t(`validation.fields.${label}`),
          min,
        });
      },
      max: ({ label, max }: { label: string; max: number }) => {
        return t('validation.max', {
          field: t(`validation.fields.${label}`),
          max,
        });
      },
    },
    // number: {
    //   min: ({ label, min }: { label: string; min: number }) => {
    //     return t('numberMin', {
    //       field: t(`fields.${label}`),
    //       min,
    //     });
    //   },
    //   max: ({ label, max }: { label: string; max: number }) => {
    //     return t('numberMax', {
    //       field: t(`fields.${label}`),
    //       max,
    //     });
    //   },
    // },
  };

  // Add custom validation methods
  const addCustomMethods = () => {
    // Password validation
    yup.addMethod<yup.StringSchema>(
      yup.string,
      'password',
      function (this, errorMsg?: string) {
        const { label } = this.describe();
        const currentField = label || 'password';

        return this.test(
          'password',
          errorMsg ||
            t('validation.password', {
              field: t(`validation.fields.${currentField}`),
            }),
          function (value) {
            const { path, createError } = this;

            if (!value) {
              return true; // Let required() handle empty values
            }

            const hasUpperCase = /(?=.*?[A-Z])/.test(value);
            const hasLowerCase = /(?=.*?[a-z])/.test(value);
            const hasNumber = /(?=.*?[0-9])/.test(value);
            const hasSpecialChar = /(?=.*?[#?!@$%^&*-])/.test(value);
            const hasMinLength = value.length >= 8;

            const isValid =
              hasUpperCase &&
              hasLowerCase &&
              hasNumber &&
              hasSpecialChar &&
              hasMinLength;

            return (
              isValid ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('validation.password', {
                    field: t('validation.fields.password'),
                  }),
              })
            );
          },
        );
      },
    );

    // No emoji validation
    yup.addMethod<yup.StringSchema>(
      yup.string,
      'noEmoji',
      function (this, errorMsg?: string) {
        const { label } = this.describe();
        const currentField = label || 'field';

        return this.test(
          'noEmoji',
          errorMsg ||
            t('validation.no_emoji', {
              field: t(`validation.fields.${currentField}`),
            }),
          function (value) {
            const { path, createError } = this;

            if (!value) {
              return true; // Let required() handle empty values
            }

            const hasEmoji = REGEX_VALIDATE.EMOJI.test(value);

            return (
              !hasEmoji ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('validation.no_emoji', {
                    field: t('validation.fields.text'),
                  }),
              })
            );
          },
        );
      },
    );

    // Is number validation
    yup.addMethod<yup.StringSchema>(
      yup.string,
      'isNumber',
      function (this, errorMsg?: string) {
        const { label } = this.describe();
        const currentField = label || 'field';

        return this.test(
          'isNumber',
          errorMsg ||
            t('validation.isNumber', {
              field: t(`validation.fields.${currentField}`),
            }),
          function (value) {
            const { path, createError } = this;

            if (!value) {
              return true; // Let required() handle empty values
            }

            const isNumber = /^\d+$/.test(value);

            return (
              isNumber ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('validation.isNumber', {
                    field: t('validation.fields.number'),
                  }),
              })
            );
          },
        );
      },
    );

    // Require select validation
    yup.addMethod<yup.StringSchema>(
      yup.string,
      'requireSelect',
      function (this, errorMsg?: string) {
        const { label } = this.describe();
        const currentField = label || 'field';

        return this.test(
          'requireSelect',
          errorMsg ||
            t('validation.requireSelect', {
              field: t(`validation.fields.${currentField}`),
            }),
          function (value) {
            const { path, createError } = this;

            return (
              !!value ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('validation.requireSelect', {
                    field: t('validation.fields.select'),
                  }),
              })
            );
          },
        );
      },
    );

    // Same as validation
    yup.addMethod<yup.StringSchema>(
      yup.string,
      'sameAs',
      function (this, field: string, errorMsg?: string) {
        const { label } = this.describe();
        const currentField = label || 'field';

        return this.test(
          'sameAs',
          errorMsg ||
            t('validation.sameAs', {
              field: t(`validation.fields.${currentField}`),
              field2: t(`validation.fields.${field}`).toLowerCase(),
            }),
          function (value) {
            const { path, createError, parent } = this;

            return (
              value === parent[field] ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('validation.sameAs', {
                    field: t(`validation.fields.${currentField}`),
                    field2: t(`validation.fields.${field}`).toLowerCase(),
                  }),
              })
            );
          },
        );
      },
    );
  };

  // Set the locale
  yup.setLocale(locale);

  // Add custom methods
  addCustomMethods();

  return yup;
};
