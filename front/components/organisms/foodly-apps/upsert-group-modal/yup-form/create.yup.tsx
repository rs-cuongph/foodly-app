import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { GROUP_TYPE_ENUM, SHARE_SCOPE_ENUM } from '@/config/constant';
import { DateHelper } from '@/shared/helper/date';
import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type CreateGroupSchemaType = {
  name: string;
  date_range: {
    start: string | null;
    end: string | null;
  };
  share_scope: string;
  menu_items: {
    name: string;
    price: string | null;
  }[];
  is_same_price: string[];
  type: string;
  price: string | null;
};

export const useCreateGroupSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    name: yupInstance.string().label('name').required(),
    date_range: yupInstance.object().shape({
      start: yupInstance.string().label('start_date').required(),
      end: yupInstance.string().label('end_date').required(),
    }),
    share_scope: yupInstance.string().label('share_scope').required(),
    menu_items: yupInstance.array().of(
      yupInstance.object().shape({
        name: yupInstance
          .string()
          .label('menu_name')
          .required()
          .max(255)
          .noEmoji(),
        price: yupInstance
          .string()
          .label('menu_price')
          .optional()
          .nullable()
          .test('conditional-price-validation', function (value) {
            const isSamePrice = this.options.context?.is_same_price;

            if (isSamePrice) {
              return true;
            }

            if (!value) {
              return this.createError({
                message: t('validation.required', {
                  field: t('validation.fields.price'),
                }),
                path: this.path,
              });
            }

            const numValue = Number(value);

            if (isNaN(numValue)) {
              return this.createError({
                message: t('validation.numeric', {
                  field: t('validation.fields.price'),
                }),
                path: this.path,
              });
            }

            if (numValue < 1000) {
              return this.createError({
                message: t('validation.min_num', {
                  min: 1000,
                  field: t('validation.fields.price'),
                }),
                path: this.path,
              });
            }

            if (numValue > 10000000) {
              return this.createError({
                message: t('validation.max_num', {
                  max: 10000000,
                  field: t('validation.fields.price'),
                }),
                path: this.path,
              });
            }

            return true;
          }),
      }),
    ),
    is_same_price: yupInstance.array().optional(),
    type: yupInstance.string().label('type').required(),
    price: yupInstance
      .string()
      .label('price')
      .optional()
      .nullable()
      .test('conditional-price-validation', function (value) {
        const isSamePrice = this.options.context?.is_same_price;

        if (!isSamePrice) {
          return true;
        }

        if (!value) {
          return this.createError({
            message: t('validation.required', {
              field: t('validation.fields.price'),
            }),
            path: this.path,
          });
        }

        const numValue = Number(value);

        if (isNaN(numValue)) {
          return this.createError({
            message: t('validation.numeric', {
              field: t('validation.fields.price'),
            }),
            path: this.path,
          });
        }

        if (numValue < 1000) {
          return this.createError({
            message: t('validation.min_num', {
              min: 1000,
              field: t('validation.fields.price'),
            }),
            path: this.path,
          });
        }

        if (numValue > 10000000) {
          return this.createError({
            message: t('validation.max_num', {
              max: 10000000,
              field: t('validation.fields.price'),
            }),
            path: this.path,
          });
        }

        return true;
      }),
  });

  return schema as yup.ObjectSchema<CreateGroupSchemaType>;
};

const useCreateGroupForm = () => {
  const [isSamePriceValue, setIsSamePriceValue] =
    React.useState<boolean>(false);
  const startDate = DateHelper.getNow().add(5, 'minute').toISOString();
  const endDate = DateHelper.getNow().add(1, 'hour').toISOString();

  const form = useForm<CreateGroupSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useCreateGroupSchema()),
    defaultValues: {
      name: 'Test Group',
      date_range: {
        start: startDate,
        end: endDate,
      },
      share_scope: SHARE_SCOPE_ENUM.PUBLIC,
      type: GROUP_TYPE_ENUM.MANUAL,
      is_same_price: [],
      menu_items: [],
      price: null,
    },
    context: {
      is_same_price: isSamePriceValue, // Add context for validation
    },
  });

  // Update context when is_same_price changes
  const isSamePrice = form.watch('is_same_price');

  React.useEffect(() => {
    setIsSamePriceValue(isSamePrice.includes('1'));
  }, [isSamePrice]);

  return form;
};

export default useCreateGroupForm;
