import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type ResetPasswordSchemaType = {
  new_password: string;
  confirm_password: string;
};

export const useResetPasswordSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
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

  return schema as yup.ObjectSchema<ResetPasswordSchemaType>;
};

const useResetPasswordForm = () => {
  const form = useForm<ResetPasswordSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useResetPasswordSchema()),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  return form;
};

export default useResetPasswordForm;
