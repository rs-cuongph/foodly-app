'use client';
import { Form } from '@heroui/form';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import {
  RequestSignInByCodeSchemaType,
  useRequestSignInByCodeForm,
} from './yup-form/signin-by-code.yup';

import MyInput from '@/components/atoms/Input';
import { STORAGE_KEYS } from '@/config/constant';
import { useRequestSignInByCodeMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

interface RequestSignInByCodeFormRef {
  handleSubmit: () => void;
}

interface RequestSignInByCodeFormProps {}

const RequestSignInByCodeForm = forwardRef<
  RequestSignInByCodeFormRef,
  RequestSignInByCodeFormProps
>((props, ref) => {
  const t = useTranslations();
  const { setEmail } = useAuthStore();
  const { setIsLoadingConfirm, setSelectedForm } = useCommonStore();
  const { showError, showSuccess } = useSystemToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useRequestSignInByCodeForm();

  const organizationCode = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE);

  const formRef = useRef<HTMLFormElement>(null);

  const requestSignInByCodeMutation = useRequestSignInByCodeMutation();

  // Handle submit form
  const onSubmit = async (data: RequestSignInByCodeSchemaType) => {
    try {
      setIsLoadingConfirm(true, ModalType.AUTH);

      const res = await requestSignInByCodeMutation.mutateAsync(data);

      if (res.message) {
        setEmail(data.email);
        showSuccess(
          t('system_message.success.request_sign_in_by_code_success'),
          res.message,
        );
        setSelectedForm(FormType.VERIFY_SIGN_IN_BY_CODE, ModalType.AUTH);
      }
    } catch (error) {
      handleErrFromApi(error, setError, showError, {
        title: t('system_message.error.request_sign_in_by_code_failed'),
      });
    } finally {
      setIsLoadingConfirm(false, ModalType.AUTH);
    }
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
        {!organizationCode && (
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
          />
        )}

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
    </Form>
  );
});

RequestSignInByCodeForm.displayName = 'RequestSignInByCodeForm';

export default RequestSignInByCodeForm;
