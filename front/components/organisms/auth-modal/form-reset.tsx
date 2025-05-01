'use client';
import { Form } from '@heroui/form';
import { Alert } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import useResetPasswordForm, {
  ResetPasswordSchemaType,
} from './yup-form/reset.yup';

import MyInputController from '@/components/atoms/controller/MyInputController';
import { STORAGE_KEYS } from '@/config/constant';
import {
  useSetFirstPasswordMutation,
  verifyResetPasswordApi,
} from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { ModalType, useCommonStore } from '@/stores/common';
interface ResetPasswordModalFormRef {
  handleSubmit: () => void;
}

interface ResetPasswordModalFormProps {}

const ResetPasswordModalForm = forwardRef<
  ResetPasswordModalFormRef,
  ResetPasswordModalFormProps
>((props, ref) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const organizationCode = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE);
  const { setSelectedForm, setIsLoadingConfirm, closeModal } = useCommonStore();
  const { showError, showSuccess } = useSystemToast();
  const { mutateAsync: setFirstPassword } = useSetFirstPasswordMutation();
  const [isExpired, setIsExpired] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useResetPasswordForm();

  const formRef = useRef<HTMLFormElement>(null);

  // Handle submit form
  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setIsLoadingConfirm(true, ModalType.AUTH);
    try {
      await setFirstPassword({
        token: searchParams.get('token') as string,
        new_password: data.new_password,
      });
      showSuccess(t('system_message.success.set_password_success'));
      closeModal(ModalType.AUTH);
    } catch (error) {
      handleErrFromApi(error, undefined, showError, {
        title: t('system_message.error.set_password_failed'),
      });
    } finally {
      setIsLoadingConfirm(false, ModalType.AUTH);
    }
  };

  // verify reset password
  const verifyResetPassword = async () => {
    const token = searchParams.get('token');

    if (token) {
      try {
        await verifyResetPasswordApi(token);
      } catch {
        setIsExpired(true);
      }
    } else {
      setIsExpired(true);
    }
  };

  // expose handleSubmit to parent
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      if (isExpired) {
        closeModal(ModalType.AUTH);

        return;
      }
      handleSubmit(onSubmit)();
    },
  }));

  // Reset form when unmount
  useEffect(() => {
    verifyResetPassword();

    return () => {
      const newPath = window.location.pathname;

      window.history.replaceState({}, '', newPath);
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
      {isExpired ? (
        <div className="w-full flex flex-col gap-4">
          <Alert
            color="danger"
            title={t('system_message.error.reset_token_expired')}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <MyInputController
            isPassword
            isRequired
            showStrengthIndicator
            trim
            control={control}
            errorMessage={errors.new_password?.message}
            label={t('change_password_modal.new_password')}
            labelPlacement="outside"
            maxLength={32}
            name="new_password"
            placeholder={t('change_password_modal.placeholder.new_password')}
          />

          <MyInputController
            isPassword
            isRequired
            trim
            control={control}
            errorMessage={errors.confirm_password?.message}
            label={t('change_password_modal.confirm_password')}
            labelPlacement="outside"
            maxLength={32}
            name="confirm_password"
            placeholder={t(
              'change_password_modal.placeholder.confirm_password',
            )}
          />
        </div>
      )}
    </Form>
  );
});

ResetPasswordModalForm.displayName = 'ResetPasswordModalForm';

export default ResetPasswordModalForm;
