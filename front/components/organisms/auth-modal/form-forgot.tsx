'use client';
import { Form } from '@heroui/form';
import { Alert } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import useForgotPasswordForm, {
  ForgotPasswordSchemaType,
} from './yup-form/forgot.yup';

import MyInput from '@/components/atoms/Input';
import { STORAGE_KEYS } from '@/config/constant';
import { useResetPasswordMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { ModalType, useCommonStore } from '@/stores/common';

interface ForgotPasswordModalFormRef {
  handleSubmit: () => void;
}

interface ForgotPasswordModalFormProps {}

const ForgotPasswordModalForm = forwardRef<
  ForgotPasswordModalFormRef,
  ForgotPasswordModalFormProps
>((props, ref) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { closeModal, setIsLoadingConfirm } = useCommonStore();
  const { mutateAsync: resetPassword } = useResetPasswordMutation();
  const { showError, showSuccess } = useSystemToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForgotPasswordForm();
  const organizationCode = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE);

  const formRef = useRef<HTMLFormElement>(null);

  // Handle submit form
  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      setIsLoadingConfirm(true, ModalType.AUTH);
      const redirectUrl = `${window.location.origin}/${locale}`;

      await resetPassword({
        email: data.email,
        organization_code: data.organization_code,
        redirect_url: redirectUrl,
      });

      setIsSuccess(true);
      setTimeout(() => {
        closeModal(ModalType.AUTH);
        setIsLoadingConfirm(false, ModalType.AUTH);
      }, 3000);
    } catch {
      showError(t('system_message.error.reset_password_failed'));
      setIsLoadingConfirm(false, ModalType.AUTH);
    } finally {
    }
  };

  // expose handleSubmit to parent
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      handleSubmit(onSubmit)();
    },
  }));

  // Remove token param when unmount
  useEffect(() => {
    return () => {
      const newPath = window.location.pathname;

      window.history.replaceState({}, '', newPath);
      reset();
    };
  }, [searchParams, reset, router]);

  return (
    <Form
      ref={formRef}
      className="w-full flex flex-col"
      validationBehavior="aria"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {isSuccess ? (
        <div className="w-full flex justify-end mt-2">
          <Alert
            color="success"
            title={t('system_message.success.reset_password_email_sent')}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <MyInput
            isRequired
            label={t('sign_in_modal.organization_code')}
            labelPlacement="outside"
            maxLength={40}
            placeholder={t('sign_in_modal.placeholder.organization_code')}
            type="text"
            {...register('organization_code')}
            disabled={!!organizationCode}
            errorMessage={errors.organization_code?.message}
            readOnly={!!organizationCode}
          />
          <MyInput
            isRequired
            label={t('sign_in_modal.email')}
            labelPlacement="outside"
            maxLength={255}
            placeholder={t('sign_in_modal.placeholder.email')}
            type="email"
            {...register('email')}
            errorMessage={errors.email?.message}
          />
        </div>
      )}
    </Form>
  );
});

ForgotPasswordModalForm.displayName = 'ForgotPasswordModalForm';

export default ForgotPasswordModalForm;
