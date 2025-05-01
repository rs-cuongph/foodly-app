import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import useChangeDisplayNameForm, {
  ChangeDisplayNameSchemaType,
} from './yup-form/change-display-name.yup';

import MyButton from '@/components/atoms/Button';
import MyInputController from '@/components/atoms/controller/MyInputController';
import { useUpdateUserInfoMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useAuthStore } from '@/stores/auth';

interface ChangeDisplayNameModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function ChangeDisplayNameModal({
  isOpen,
  onClose,
}: ChangeDisplayNameModalProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useChangeDisplayNameForm();
  const t = useTranslations();
  const { showSuccess, showError } = useSystemToast();
  const { userInfo, setDisplayName } = useAuthStore();
  const { mutateAsync: updateUserInfo, isPending: isPendingUpdateUserInfo } =
    useUpdateUserInfoMutation();

  const onSubmit = async (data: ChangeDisplayNameSchemaType) => {
    try {
      await updateUserInfo({
        display_name: data.display_name,
      });
      setDisplayName(data.display_name);
      showSuccess(t('system_message.success.change_display_name'));
      onClose?.();
    } catch (error) {
      handleErrFromApi(error, setError, showError);
    }
  };

  useEffect(() => {
    reset({
      display_name: '',
    });
  }, [isOpen]);

  return (
    <Modal isDismissable={false} isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-semibold uppercase">
            {t('change_display_name_modal.title')}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-primary-500 font-semibold">
              {userInfo?.display_name}
            </p>
            <MyInputController
              isRequired
              trim
              control={control}
              errorMessage={errors.display_name?.message}
              label={t('change_display_name_modal.display_name')}
              labelPlacement="outside"
              maxLength={100}
              name="display_name"
              placeholder={t(
                'change_display_name_modal.display_name_placeholder',
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
            isLoading={isPendingUpdateUserInfo}
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
