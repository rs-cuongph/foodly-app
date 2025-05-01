import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import useChangePasswordForm, {
  ChangePasswordSchemaType,
} from './yup-form/change-password.yup';

import MyButton from '@/components/atoms/Button';
import MyInputController from '@/components/atoms/controller/MyInputController';
import { useUpdatePasswordMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useChangePasswordForm();
  const t = useTranslations();
  const { showSuccess, showError } = useSystemToast();

  const { mutateAsync: updatePassword, isPending: isPendingUpdatePassword } =
    useUpdatePasswordMutation();

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    try {
      await updatePassword({
        password: data.password,
        new_password: data.new_password,
      });
      showSuccess(t('system_message.success.update_password'));
      onClose?.();
    } catch (error) {
      handleErrFromApi(error, setError, showError, {
        title: t('system_message.error.update_password'),
      });
    }
  };

  useEffect(() => {
    reset({
      password: '',
      new_password: '',
      confirm_password: '',
    });
  }, [isOpen]);

  return (
    <Modal isDismissable={false} isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-semibold uppercase">
            {t('add_payment_modal.title')}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <MyInputController
              isPassword
              isRequired
              trim
              control={control}
              errorMessage={errors.password?.message}
              label={t('change_password_modal.password')}
              labelPlacement="outside"
              maxLength={100}
              name="password"
              placeholder={t('change_password_modal.placeholder.password')}
            />
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
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <MyButton
            className="min-w-24"
            type="button"
            variant="light"
            onPress={onClose}
          >
            {t('button.close')}
          </MyButton>
          <MyButton
            className="min-w-24"
            isLoading={isPendingUpdatePassword}
            type="button"
            onPress={() => handleSubmit(onSubmit)()}
          >
            {t('button.confirm')}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
