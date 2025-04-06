'use client';
import { Form } from '@heroui/form';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import useSignInForm, { SignInSchemaType } from './yup-form/signin.yup';

import { MyButton } from '@/components/atoms/Button';
import MyInput from '@/components/atoms/Input';
import InputPassword from '@/components/atoms/InputPassword';
import { MailIcon } from '@/components/atoms/icons';
import { LOCAL_STORAGE_KEYS } from '@/config/constant';
import { FormType, useCommonStore } from '@/stores/common';

interface SignInModalFormRef {
  handleSubmit: () => void;
}

interface SignInModalFormProps {}

const SignInModalForm = forwardRef<SignInModalFormRef, SignInModalFormProps>(
  (props, ref) => {
    const tButton = useTranslations('button');
    const tSignInModal = useTranslations('sign_in_modal');
    const { setSelectedForm } = useCommonStore();
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useSignInForm();

    const organizationCode = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ORGANIZATION_CODE,
    );

    const formRef = useRef<HTMLFormElement>(null);

    // Handle submit form
    const onSubmit = (data: SignInSchemaType) => {
      const res = signIn('emailLogin', {
        email: data.email,
        password: data.password,
        organization_code: data.organization_code,
      });

      console.log('====>', res);
    };

    // expose handleSubmit to parent
    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    // Reset form when unmount
    useEffect(() => {
      return () => {
        reset();
      };
    }, []);

    return (
      <Form
        ref={formRef}
        className="w-full flex flex-col"
        validationBehavior="aria"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="w-full flex flex-col gap-4">
          <MyInput
            isRequired
            label={tSignInModal('organization_code')}
            labelPlacement="outside"
            maxLength={40}
            placeholder={tSignInModal('placeholder.organization_code')}
            type="text"
            {...register('organization_code')}
            disabled={!!organizationCode}
            errorMessage={errors.organization_code?.message}
            readOnly={!!organizationCode}
          />
          <MyInput
            isRequired
            label={tSignInModal('email')}
            labelPlacement="outside"
            maxLength={255}
            placeholder={tSignInModal('placeholder.email')}
            type="email"
            {...register('email')}
            errorMessage={errors.email?.message}
          />
          <InputPassword
            isRequired
            label={tSignInModal('password')}
            labelPlacement="outside"
            maxLength={255}
            placeholder={tSignInModal('placeholder.password')}
            {...register('password')}
            errorMessage={errors.password?.message}
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
          <MyButton color="danger" role="button" type="button" variant="shadow">
            <MailIcon className="w-6 h-6 text-white" />
            {tButton('login_with_code')}
          </MyButton>
        </div>
      </Form>
    );
  },
);

SignInModalForm.displayName = 'SignInModalForm';

export default SignInModalForm;
