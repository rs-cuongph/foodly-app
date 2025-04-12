'use client';

import { Form } from '@heroui/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import useInviteCodeModalForm, {
  InviteCodeModalSchemaType,
} from './create.yup';

import { MyButton } from '@/components/atoms/Button';
import MyInputController from '@/components/atoms/controller/MyInputController';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';

type InviteCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (invite_code: string) => Promise<void>;
};
export default function InviteCodeModal({
  isOpen,
  onClose,
  onSubmit,
}: InviteCodeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  const searchParams = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
  } = useInviteCodeModalForm();
  const { showError, showSuccess } = useSystemToast();
  const formRef = useRef<HTMLFormElement>(null);

  const _onSubmit = async (data: InviteCodeModalSchemaType) => {
    setIsLoading(true);
    onSubmit?.(data.invite_code)
      .then(() => {
        setIsLoading(false);
        showSuccess(t('system_message.success.invite_code_success'));
      })
      .catch((e) => {
        handleErrFromApi(e, setError, showError, {
          title: t('system_message.error.invite_code'),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const inviteCode = searchParams.get('invite_code');

    if (inviteCode) setValue('invite_code', inviteCode);
  }, []);

  return (
    <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold">
            {t('invite_code_modal.title').toUpperCase()}
          </h3>
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          <Form
            ref={formRef}
            className="w-full flex flex-col"
            validationBehavior="aria"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <MyInputController
              isRequired
              control={control}
              errorMessage={errors.invite_code?.message}
              label={t('invite_code_modal.label.invite_code')}
              labelPlacement="outside"
              name="invite_code"
              placeholder={t('invite_code_modal.placeholder.invite_code')}
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <MyButton variant="light" onPress={onClose}>
            {t('button.close')}
          </MyButton>
          <MyButton
            isLoading={isLoading}
            onPress={() => handleSubmit(_onSubmit)()}
          >
            {t('button.confirm')}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
