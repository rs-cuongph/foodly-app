import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type AddPaymentSchemaType = {
  payment_method: string;
  account_number: string;
  account_name: string;
};

export const useAddPaymentSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    payment_method: yupInstance
      .string()
      .label('payment_method')
      .trim()
      .required(),
    account_number: yupInstance
      .string()
      .label('account_number')
      .trim()
      .max(32)
      .matches(
        /^[0-9]+$/,
        t('validation.numeric', {
          field: t('validation.fields.account_number'),
        }),
      )
      .required(),
    account_name: yupInstance
      .string()
      .label('account_name')
      .trim()
      .max(100)
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('validation.alphanumeric_with_space', {
          field: t('validation.fields.account_name'),
        }),
      )
      .required(),
  });

  return schema as yup.ObjectSchema<AddPaymentSchemaType>;
};

const useAddPaymentForm = () => {
  const form = useForm<AddPaymentSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useAddPaymentSchema()),
    defaultValues: {
      payment_method: '',
      account_number: '',
      account_name: '',
    },
  });

  return form;
};

export default useAddPaymentForm;
