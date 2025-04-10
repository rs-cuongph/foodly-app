'use client';
import { Form } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import useSignUpForm from './yup-form/signup.yup';

import MyInput from '@/components/atoms/Input';
import InputPassword from '@/components/atoms/InputPassword';
import { LOCAL_STORAGE_KEYS } from '@/config/constant';
import { siteConfig } from '@/config/site';
import { useSignUpMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { useRouter } from '@/i18n/navigation';
import { handleErrFromApi } from '@/shared/helper/validation';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

interface SignUpModalFormRef {
  handleSubmit: () => void;
}

interface SignUpModalFormProps {}

interface SignUpFormData {
  organization_code: string;
  email: string;
  password: string;
  confirm_password: string;
  display_name?: string;
}

const SignUpModalForm = forwardRef<SignUpModalFormRef, SignUpModalFormProps>(
  (props, ref) => {
    const tSignUpModal = useTranslations('sign_up_modal');
    const { setSelectedForm, closeModal, setIsLoadingConfirm } =
      useCommonStore();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const { showError } = useSystemToast();
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setError,
    } = useSignUpForm();

    const signUpMutation = useSignUpMutation();

    const organizationCode = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ORGANIZATION_CODE,
    );

    const onSubmit = async (data: SignUpFormData) => {
      try {
        setIsLoadingConfirm(true, ModalType.AUTH);
        const response = await signUpMutation.mutateAsync(data);

        console.log(response);
        if (response.access_token) {
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
            response.access_token,
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
            response.refresh_token,
          );

          signIn('tokenLogin', {
            ...response,
          });

          closeModal(ModalType.AUTH);
          router.push(siteConfig.routes.home);
        }
      } catch (error) {
        handleErrFromApi(error, setError, showError);
      } finally {
        setIsLoadingConfirm(false, ModalType.AUTH);
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <Form ref={formRef} className="w-full flex flex-col">
        <div className="w-full flex flex-col gap-4">
          <MyInput
            isRequired
            label={tSignUpModal('organization_code')}
            labelPlacement="outside"
            maxLength={40}
            placeholder={tSignUpModal('placeholder.organization_code')}
            {...register('organization_code')}
            disabled={!!organizationCode}
            errorMessage={errors.organization_code?.message}
            readOnly={!!organizationCode}
          />
          <MyInput
            isRequired
            label={tSignUpModal('email')}
            labelPlacement="outside"
            placeholder={tSignUpModal('placeholder.email')}
            type="email"
            {...register('email')}
            errorMessage={errors.email?.message}
          />
          <InputPassword
            isRequired
            showStrengthIndicator
            label={tSignUpModal('password')}
            labelPlacement="outside"
            placeholder={tSignUpModal('placeholder.password')}
            {...register('password')}
            errorMessage={errors.password?.message}
          />
          <InputPassword
            isRequired
            label={tSignUpModal('confirm_password')}
            labelPlacement="outside"
            placeholder={tSignUpModal('placeholder.confirm_password')}
            {...register('confirm_password')}
            errorMessage={errors.confirm_password?.message}
          />
          <MyInput
            isRequired
            label={tSignUpModal('display_name')}
            labelPlacement="outside"
            placeholder={tSignUpModal('placeholder.display_name')}
            {...register('display_name')}
            errorMessage={errors.display_name?.message}
          />
        </div>

        <div className="w-full flex justify-center mt-2">
          <span className="text-sm">{tSignUpModal('have_account')}</span>
          <span
            className="text-sm ml-1 text-primary underline cursor-pointer"
            role="button"
            onClick={() => setSelectedForm(FormType.SIGN_IN, ModalType.AUTH)}
          >
            {tSignUpModal('sign_in')}
          </span>
          <span className="text-sm ml-1"> {tSignUpModal('now')}</span>
        </div>
      </Form>
    );
  },
);

SignUpModalForm.displayName = 'SignUpModalForm';

export default SignUpModalForm;
