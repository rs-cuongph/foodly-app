'use client';
import { Form } from '@heroui/react';
import { useTranslations } from 'next-intl';

import MyInput from '@/components/atoms/Input';
import InputPassword from '@/components/atoms/InputPassword';
import { FormType, useCommonStore } from '@/stores/common';

export default function SignUpModalForm() {
  const tButton = useTranslations('button');
  const tCommon = useTranslations('common');
  const tSignUpModal = useTranslations('sign_up_modal');
  const { setSelectedForm } = useCommonStore();

  return (
    <Form className="w-full flex flex-col">
      <div className="w-full flex flex-col gap-4">
        <MyInput
          isRequired
          label={tSignUpModal('organization_code')}
          labelPlacement="outside"
          maxLength={40}
          name="organization_code"
          placeholder={tSignUpModal('placeholder.organization_code')}
        />
        <MyInput
          isRequired
          label={tSignUpModal('email')}
          labelPlacement="outside"
          name="email"
          placeholder={tSignUpModal('placeholder.email')}
          type="email"
        />
        <InputPassword
          isRequired
          label={tSignUpModal('password')}
          labelPlacement="outside"
          name="password"
          placeholder={tSignUpModal('placeholder.password')}
        />
        <InputPassword
          isRequired
          label={tSignUpModal('confirm_password')}
          labelPlacement="outside"
          name="confirm_password"
          placeholder={tSignUpModal('placeholder.confirm_password')}
        />
        <MyInput
          label={tSignUpModal('display_name')}
          labelPlacement="outside"
          name="display_name"
          placeholder={tSignUpModal('placeholder.display_name')}
        />
      </div>

      <div className="w-full flex justify-center mt-2">
        <span className="text-sm">{tSignUpModal('have_account')}</span>
        <span
          className="text-sm ml-1 text-primary underline cursor-pointer"
          role="button"
          onClick={() => setSelectedForm(FormType.SIGN_IN)}
        >
          {tSignUpModal('sign_in')}
        </span>
        <span className="text-sm ml-1"> {tSignUpModal('now')}</span>
      </div>
    </Form>
  );
}
