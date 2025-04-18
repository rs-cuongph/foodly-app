import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type SettingOrderSchemaType = {
  menu: { id: string }[];
  quantity: number;
  group_id: string;
};

export const useSettingOrderSchema = () => {
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

  return schema as yup.ObjectSchema<SettingOrderSchemaType>;
};

const useSettingOrderForm = () => {
  const form = useForm<SettingOrderSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useSettingOrderSchema()),
    defaultValues: {
      email: 'nhuquynh03@gmail.com',
      password: 'NhuQuynh2503@',
      organization_code: localStorage.getItem('ORGANIZATION_CODE') || '',
    },
  });

  return form;
};

export default useSettingOrderForm;
