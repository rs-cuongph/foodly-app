import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { STORAGE_KEYS } from '@/config/constant';
import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type ForgotPasswordSchemaType = {
  email: string;
  organization_code: string;
};

export const useForgotPasswordSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  const schema = yupInstance.object().shape({
    email: yupInstance.string().label('email').trim().required().email(),
    organization_code: yupInstance
      .string()
      .label('organization_code')
      .trim()
      .required(),
  });

  return schema as yup.ObjectSchema<ForgotPasswordSchemaType>;
};

const useForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useForgotPasswordSchema()),
    defaultValues: {
      email: '',
      organization_code:
        localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE) || '',
    },
  });

  return form;
};

export default useForgotPasswordForm;
