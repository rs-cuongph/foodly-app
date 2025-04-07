import * as yup from 'yup';

import { REGEX_VALIDATE } from './regex-validate';

// This function creates a Yup schema with i18n support
export const createI18nYupSchema = (t: any) => {
  // Set up custom locale for Yup
  const locale = {
    mixed: {
      required: ({ label }: { label: string }) => {
        return t('required', {
          field: t(`fields.${label}`),
        });
      },
    },
    string: {
      email: ({ label }: { label: string }) => {
        return t('email', {
          field: t(`fields.${label}`),
        });
      },
      min: ({ label, min }: { label: string; min: number }) => {
        return t('min', {
          field: t(`fields.${label}`),
          min,
        });
      },
      max: ({ label, max }: { label: string; max: number }) => {
        return t('max', {
          field: t(`fields.${label}`),
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
        return this.test(
          'password',
          errorMsg ||
            t('password', {
              field: t('fields.password'),
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
                  t('password', {
                    field: t('fields.password'),
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
        return this.test(
          'noEmoji',
          errorMsg || t('no_emoji', { field: t('fields.text') }),
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
                  t('no_emoji', {
                    field: t('fields.text'),
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
        return this.test(
          'isNumber',
          errorMsg || t('isNumber', { field: t('fields.number') }),
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
                  t('isNumber', {
                    field: t('fields.number'),
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
        return this.test(
          'requireSelect',
          errorMsg ||
            t('requireSelect', {
              field: t('fields.select'),
            }),
          function (value) {
            const { path, createError } = this;

            return (
              !!value ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('requireSelect', {
                    field: t('fields.select'),
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
        const currentField = this.label || 'field';

        return this.test(
          'sameAs',
          errorMsg ||
            t('sameAs', {
              field: t(`fields.${currentField}`),
              field2: t(`fields.${field}`).toLowerCase(),
            }),
          function (value) {
            const { path, createError, parent } = this;

            return (
              value === parent[field] ||
              createError({
                path,
                message:
                  errorMsg ||
                  t('sameAs', {
                    field: t(`fields.${currentField}`),
                    field2: t(`fields.${field}`).toLowerCase(),
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
