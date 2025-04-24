'use client';

import {
  Alert,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { MyButton } from '@/components/atoms/Button';
import { siteConfig } from '@/config/site';
import {
  useDeleteGroupMutation,
  useLockGroupMutation,
} from '@/hooks/api/apps/foodly/group';
import { useConfirmPaidMutation } from '@/hooks/api/apps/foodly/order';
import { useSystemToast } from '@/hooks/toast';
import { useRouter } from '@/i18n/navigation';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

export type ConfirmModalKind =
  | 'delete'
  | 'lock'
  | 'update'
  | 'confirm_paid'
  | 'cancel_order';

export interface ConfirmModalConfig {
  title: string;
  description: string;
  color: string;
  variant: 'solid' | 'outline' | 'ghost' | 'light' | 'link' | 'default';
  alertStatus:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'secondary';
  confirmText: string;
  cancelText: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmModal() {
  const t = useTranslations();
  const router = useRouter();
  const { mutateAsync: lockGroup, isPending: isPendingLock } =
    useLockGroupMutation();
  const { mutateAsync: deleteGroup, isPending: isPendingDelete } =
    useDeleteGroupMutation();
  const { mutateAsync: confirmPaid, isPending: isPendingConfirmPaid } =
    useConfirmPaidMutation();
  const { showSuccess, showError } = useSystemToast();
  const { groupInfo } = useGroupStore();
  const { modalConfirm, setModalConfirm } = useCommonStore();
  const { isOpen, kind } = modalConfirm;

  const getModalConfig = (
    kind: ConfirmModalKind,
  ): ConfirmModalConfig | undefined => {
    switch (kind) {
      case 'delete':
        return {
          title: t('common.modal_title.confirm_delete'),
          description: t('common.modal_description.confirm_delete'),
          color: 'danger',
          variant: 'solid',
          alertStatus: 'danger',
          confirmText: t('button.confirm'),
          cancelText: t('button.close'),
          onCancel: () => setModalConfirm({ isOpen: false }),
          onConfirm: async () => {
            if (!groupInfo?.id) return;
            try {
              await deleteGroup({
                id: groupInfo.id,
                invite_code: groupInfo.invite_code,
              });
              showSuccess(t('system_message.success.delete_group'));
              router.push(siteConfig.apps.foodly.routes.home);
            } catch (error) {
              handleErrFromApi(error, undefined, showError, {
                title: t('common.modal_title.confirm_delete'),
              });
            } finally {
              setModalConfirm({ isOpen: false });
            }
          },
        };
      case 'lock':
        return {
          title: t('common.modal_title.confirm_lock'),
          description: t('common.modal_description.confirm_lock'),
          color: 'danger',
          variant: 'solid',
          alertStatus: 'danger',
          confirmText: t('button.confirm'),
          cancelText: t('button.close'),
          onCancel: () => setModalConfirm({ isOpen: false }),
          onConfirm: async () => {
            if (!groupInfo?.id) return;
            try {
              await lockGroup({
                id: groupInfo.id,
                invite_code: groupInfo.invite_code,
              });
              showSuccess(t('system_message.success.lock_group'));
            } catch (error) {
              handleErrFromApi(error, undefined, showError, {
                title: t('common.modal_title.confirm_lock'),
              });
            } finally {
              setModalConfirm({ isOpen: false });
            }
          },
        };
      case 'confirm_paid':
        return {
          title: t('common.modal_title.confirm_paid'),
          description: t('common.modal_description.confirm_paid'),
          color: 'primary',
          variant: 'solid',
          alertStatus: 'primary',
          confirmText: t('button.confirm'),
          cancelText: t('button.close'),
          onCancel: () => setModalConfirm({ isOpen: false }),
          onConfirm: async () => {
            if (!modalConfirm.data?.orderId) return;
            try {
              await confirmPaid(modalConfirm.data.orderId);
              showSuccess(t('system_message.success.confirm_paid'));
            } catch (error) {
              handleErrFromApi(error, undefined, showError, {
                title: t('common.modal_title.confirm_paid'),
              });
            } finally {
              setModalConfirm({ isOpen: false });
            }
          },
        };
      default:
        return undefined;
    }
  };

  const modalConfig = useMemo(() => getModalConfig(kind), [kind, groupInfo]);

  return (
    <Modal
      backdrop="blur"
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      size="md"
      onClose={modalConfig?.onCancel}
    >
      <ModalContent className="p-1">
        <ModalHeader className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-semibold">
            {modalConfig?.title?.toUpperCase()}
          </h3>
        </ModalHeader>

        <ModalBody>
          <Alert
            color={modalConfig?.alertStatus}
            title={modalConfig?.description}
          />
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <MyButton
            className="min-w-24"
            color={modalConfig?.alertStatus}
            variant="light"
            onPress={modalConfig?.onCancel}
          >
            {modalConfig?.cancelText}
          </MyButton>
          <MyButton
            className="min-w-24"
            color={modalConfig?.alertStatus}
            isLoading={isPendingLock || isPendingDelete || isPendingConfirmPaid}
            onPress={modalConfig?.onConfirm}
          >
            {modalConfig?.confirmText}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
