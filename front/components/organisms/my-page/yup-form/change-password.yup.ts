import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type ChangePasswordSchemaType = {
  password: string;
  new_password: string;
  confirm_password: string;
};

export const useChangePasswordSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    password: yupInstance.string().label('password').trim().required(),
    new_password: yupInstance
      .string()
      .label('new_password')
      .trim()
      .password()
      .required(),
    confirm_password: yupInstance
      .string()
      .label('confirm_password')
      .trim()
      .required()
      .sameAs('new_password'),
  });

  return schema as yup.ObjectSchema<ChangePasswordSchemaType>;
};

const useChangePasswordForm = () => {
  const form = useForm<ChangePasswordSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useChangePasswordSchema()),
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  return form;
};

export default useChangePasswordForm;
