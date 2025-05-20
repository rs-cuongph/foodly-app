import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { STORAGE_KEYS } from '@/config/constant';
import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type SignInSchemaType = {
  email: string;
  password: string;
  organization_code?: string;
};

export const useSignInSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    email: yupInstance.string().label('email').trim().required().email(),
    password: yupInstance.string().label('password').trim().required(),
    organization_code: yupInstance
      .string()
      .label('organization_code')
      .trim()
      .required(),
  });

  return schema as yup.ObjectSchema<SignInSchemaType>;
};

const useSignInForm = () => {
  const form = useForm<SignInSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useSignInSchema()),
    defaultValues: {
      email: '',
      password: '',
      organization_code:
        localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE) || '',
    },
  });

  return form;
};

export default useSignInForm;
