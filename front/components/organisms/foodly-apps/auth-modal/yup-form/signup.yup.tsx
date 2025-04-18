import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type SignUpSchemaType = {
  email: string;
  password: string;
  confirm_password: string;
  organization_code: string;
  display_name?: string;
};

export const useSignUpSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  const schema = yupInstance.object().shape({
    email: yupInstance.string().label('email').trim().required().email(),
    password: yupInstance.string().label('password').trim().required(),
    confirm_password: yupInstance
      .string()
      .label('confirm_password')
      .trim()
      .required()
      .sameAs('password'),
    organization_code: yupInstance
      .string()
      .label('organization_code')
      .trim()
      .required(),
    display_name: yupInstance.string().label('display_name').trim().required(),
  });

  return schema as yup.ObjectSchema<SignUpSchemaType>;
};

const useSignUpForm = () => {
  const form = useForm<SignUpSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useSignUpSchema()),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      organization_code: localStorage.getItem('ORGANIZATION_CODE') || '',
      display_name: '',
    },
  });

  return form;
};

export default useSignUpForm;
