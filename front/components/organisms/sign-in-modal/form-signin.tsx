'use client';
import { Form } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { MyButton } from '@/components/atoms/Button';
import MyInput from '@/components/atoms/Input';
import InputPassword from '@/components/atoms/InputPassword';
import { MailIcon } from '@/components/atoms/icons';
import { FormType, useCommonStore } from '@/stores/common';

export default function SignInModalForm() {
  const tButton = useTranslations('button');
  const tCommon = useTranslations('common');
  const tSignInModal = useTranslations('sign_in_modal');
  const { setSelectedForm } = useCommonStore();

  return (
    <Form className="w-full flex flex-col">
      <div className="w-full flex flex-col gap-4">
        <MyInput
          isRequired
          label={tSignInModal('organization_code')}
          labelPlacement="outside"
          maxLength={40}
          name="organization_code"
          placeholder={tSignInModal('placeholder.organization_code')}
          type="text"
        />
        <MyInput
          isRequired
          label={tSignInModal('email')}
          labelPlacement="outside"
          maxLength={255}
          name="email"
          placeholder={tSignInModal('placeholder.email')}
          type="email"
        />
        <InputPassword
          isRequired
          label={tSignInModal('password')}
          labelPlacement="outside"
          maxLength={255}
          name="password"
          placeholder={tSignInModal('placeholder.password')}
        />
      </div>
      <div className="w-full flex justify-end mt-2">
        <span className="text-sm text-primary underline cursor-pointer">
          {tSignInModal('forgot_password')}
        </span>
      </div>
      <div className="w-full flex justify-center mt-2">
        <span className="text-sm">{tSignInModal('dont_have_account')}</span>
        <span
          className="text-sm ml-1 text-primary underline cursor-pointer"
          role="button"
          onClick={() => setSelectedForm(FormType.SIGN_UP)}
        >
          {tSignInModal('sign_up')}
        </span>
        <span className="text-sm ml-1"> {tSignInModal('now')}</span>
      </div>
      <div className="w-fit flex justify-center items-center mt-2 mx-auto">
        <div className="h-[1px] w-[100px] bg-primary-200" />
        <span className="text-sm text-primary-200 mx-2 flex-1">
          {tSignInModal('or')}
        </span>
        <div className="h-[1px] w-[100px] bg-primary-200" />
      </div>
      <div className="w-full flex justify-center mt-2">
        <MyButton color="danger" type="button" variant="shadow">
          <MailIcon className="w-6 h-6 text-white" />
          {tButton('login_with_code')}
        </MyButton>
      </div>
    </Form>
  );
}
