import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type SettingOrderSchemaType = {
  menu: { id: string }[];
  quantity: number | null;
  note: string;
  payment_setting: {
    account_name: string;
    account_number: string;
    payment_method: string;
  }[];
};

export const useSettingOrderSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    menu: yupInstance.array().of(
      yupInstance.object().shape({
        id: yupInstance.string().label('menu_id').required(),
      }),
    ),
    quantity: yupInstance.number().required().min(1).max(20),
    note: yupInstance.string().label('note').required().max(500),
    payment_setting: yupInstance.array().of(
      yupInstance.object().shape({
        account_name: yupInstance.string().label('account_name').required(),
        account_number: yupInstance.string().label('account_number').required(),
        payment_method: yupInstance.string().label('payment_method').required(),
      }),
    ),
  });

  return schema as yup.ObjectSchema<SettingOrderSchemaType>;
};

const useSettingOrderForm = () => {
  const form = useForm<SettingOrderSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useSettingOrderSchema()),
    defaultValues: {
      menu: [],
      quantity: 1,
      note: '',
      payment_setting: [],
    },
  });

  return form;
};

export default useSettingOrderForm;
