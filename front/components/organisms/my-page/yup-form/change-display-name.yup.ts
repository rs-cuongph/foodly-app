import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { createI18nYupSchema } from '@/shared/yup-validate/i18n-validate-helper';

export type ChangeDisplayNameSchemaType = {
  display_name: string;
};

export const useChangeDisplayNameSchema = () => {
  const t = useTranslations();
  const yupInstance = createI18nYupSchema(t);

  // Create a schema that exactly matches SignInSchemaType
  const schema = yupInstance.object().shape({
    display_name: yupInstance
      .string()
      .label('display_name')
      .trim()
      .max(100)
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('validation.alphanumeric_with_space', {
          field: t('validation.fields.display_name'),
        }),
      )
      .required(),
  });

  return schema as yup.ObjectSchema<ChangeDisplayNameSchemaType>;
};

const useChangeDisplayNameForm = () => {
  const form = useForm<ChangeDisplayNameSchemaType>({
    mode: 'onChange',
    resolver: yupResolver(useChangeDisplayNameSchema()),
    defaultValues: {
      display_name: '',
    },
  });

  return form;
};

export default useChangeDisplayNameForm;
