import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import useAddPaymentForm, {
  AddPaymentSchemaType,
} from './yup-form/add-payment.yup';

import MyButton from '@/components/atoms/Button';
import MyInputController from '@/components/atoms/controller/MyInputController';
import MySelectController from '@/components/atoms/controller/MySelectController';
import { useUpdateUserInfoMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useAuthStore } from '@/stores/auth';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
}: AddPaymentModalProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useAddPaymentForm();
  const t = useTranslations();
  const { showSuccess, showError } = useSystemToast();
  const { paymentSettings: currentPaymentSettings, setPaymentSetting } =
    useAuthStore();
  const { mutateAsync: updateUserInfo, isPending: isPendingUpdateUserInfo } =
    useUpdateUserInfoMutation();

  const paymentMethods = [
    { key: 'vietcombank', label: 'Vietcombank' },
    { key: 'mbbank', label: 'MB Bank' },
    { key: 'vib', label: 'VIB Bank' },
  ];

  const onSubmit = async (data: AddPaymentSchemaType) => {
    const paymentSetting = [...currentPaymentSettings(), data];

    try {
      await updateUserInfo({
        payment_setting: paymentSetting,
      });
      setPaymentSetting(paymentSetting);
      showSuccess(t('system_message.success.update_payment_setting'));
      onClose?.();
    } catch (error) {
      handleErrFromApi(error, setError, showError);
    }
  };

  useEffect(() => {
    reset({
      account_name: '',
      account_number: '',
      payment_method: '',
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
              isRequired
              trim
              control={control}
              errorMessage={errors.account_name?.message}
              label={t('add_payment_modal.account_name')}
              labelPlacement="outside"
              maxLength={100}
              name="account_name"
              placeholder={t('add_payment_modal.placeholder.account_name')}
            />
            <MyInputController
              isRequired
              trim
              control={control}
              errorMessage={errors.account_number?.message}
              label={t('add_payment_modal.account_number')}
              labelPlacement="outside"
              maxLength={32}
              name="account_number"
              placeholder={t('add_payment_modal.placeholder.account_number')}
            />
            <MySelectController
              isRequired
              control={control}
              errorMessage={errors.payment_method?.message}
              label={t('add_payment_modal.payment_method')}
              labelPlacement="outside"
              name="payment_method"
              options={paymentMethods}
              placeholder={t('add_payment_modal.placeholder.payment_method')}
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
