import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { STORAGE_KEYS } from '@/config/constant';
import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type RequestSignInByCodeSchemaType = {
  email: string;
  organization_code: string;
};

export type VerifySignInByCodeSchemaType = {
  code: string;
  organization_code: string;
};

export const useRequestSignInByCodeSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    email: yupInstance.string().label('email').trim().required().email(),
    organization_code: yupInstance
      .string()
      .label('organization_code')
      .trim()
      .required(),
  });

  return schema as yup.ObjectSchema<RequestSignInByCodeSchemaType>;
};

export const useVerifySignInByCodeSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  const schema = yupInstance.object().shape({
    code: yupInstance.string().label('code').trim().required().max(6),
    organization_code: yupInstance
      .string()
      .label('organization_code')
      .trim()
      .required(),
  });

  return schema as yup.ObjectSchema<VerifySignInByCodeSchemaType>;
};

const useRequestSignInByCodeForm = () => {
  const form = useForm<RequestSignInByCodeSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useRequestSignInByCodeSchema()),
    defaultValues: {
      email: '',
      organization_code:
        localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE) || '',
    },
  });

  return form;
};

const useVerifySignInByCodeForm = () => {
  const form = useForm<VerifySignInByCodeSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useVerifySignInByCodeSchema()),
    defaultValues: {
      code: '',
      organization_code:
        localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE) || '',
    },
  });

  return form;
};

export { useRequestSignInByCodeForm, useVerifySignInByCodeForm };
