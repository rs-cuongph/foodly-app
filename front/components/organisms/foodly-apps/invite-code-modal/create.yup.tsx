import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type InviteCodeModalSchemaType = {
  invite_code: string;
};

export const useInviteCodeModalSchema = () => {
  const t = useTranslations('validation');
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    invite_code: yupInstance.string().label('invite_code').required(),
  });

  return schema as yup.ObjectSchema<InviteCodeModalSchemaType>;
};

const useInviteCodeModalForm = () => {
  const form = useForm<InviteCodeModalSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useInviteCodeModalSchema()),
    defaultValues: {
      invite_code: '',
    },
  });

  return form;
};

export default useInviteCodeModalForm;
