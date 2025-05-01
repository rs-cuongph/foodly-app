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
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MyButton } from '@/components/atoms/Button';
import MyTextarea from '@/components/atoms/Textarea';
import { ORDER_STATUS_ENUM } from '@/config/constant';
import { siteConfig } from '@/config/site';
import {
  useDeleteGroupMutation,
  useLockGroupMutation,
} from '@/hooks/api/group';
import {
  useCancelOrderMutation,
  useConfirmPaidMutation,
  useMarkPaidMutation,
} from '@/hooks/api/order';
import { useSystemToast } from '@/hooks/toast';
import { useRouter } from '@/i18n/navigation';
import { DateHelper } from '@/shared/helper/date';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

export type ConfirmModalKind =
  | 'delete'
  | 'lock'
  | 'update'
  | 'confirm_paid'
  | 'cancel_order'
  | 'qr_code';

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
  const { mutateAsync: cancelOrder, isPending: isPendingCancelOrder } =
    useCancelOrderMutation();
  const { mutateAsync: markPaid, isPending: isPendingMarkPaid } =
    useMarkPaidMutation();
  const { showSuccess, showError } = useSystemToast();
  const { groupInfo } = useGroupStore();
  const { modalConfirm, setModalConfirm } = useCommonStore();
  const { isOpen, kind } = modalConfirm;
  const [reason, setReason] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(90); // 1 minute and 30 seconds

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
              router.push(siteConfig.apps.routes.home);
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
      case 'cancel_order':
        return {
          title: t('common.modal_title.cancel_order'),
          description: t('common.modal_description.cancel_order'),
          color: 'danger',
          variant: 'solid',
          alertStatus: 'danger',
          confirmText: t('button.confirm'),
          cancelText: t('button.close'),
          onCancel: () => setModalConfirm({ isOpen: false }),
          onConfirm: async () => {
            if (!modalConfirm.data?.orderId) return;
            try {
              await cancelOrder({
                orderId: modalConfirm.data.orderId,
                reason,
              });
              showSuccess(t('system_message.success.cancel_order'));
            } catch (error) {
              handleErrFromApi(error, undefined, showError, {
                title: t('common.modal_title.cancel_order'),
              });
            } finally {
              setModalConfirm({ isOpen: false });
            }
          },
        };
      case 'qr_code': {
        return {
          title: t('common.modal_title.qr_code'),
          description: '',
          color: 'primary',
          variant: 'solid',
          alertStatus: 'primary',
          confirmText: t('button.i_paid'),
          cancelText: t('button.close'),
          onCancel: () => setModalConfirm({ isOpen: false }),
          onConfirm: async () => {
            if (!modalConfirm.data?.orderId) return;
            if (modalConfirm.data.orderStatus === ORDER_STATUS_ENUM.PROCESSING)
              return setModalConfirm({ isOpen: false });
            try {
              await markPaid(modalConfirm.data.orderId);
              showSuccess(t('system_message.success.mark_paid'));
            } catch (error) {
              handleErrFromApi(error, undefined, showError, {
                title: t('common.modal_title.mark_paid'),
              });
            } finally {
              setModalConfirm({ isOpen: false });
            }
          },
        };
      }

      default:
        return undefined;
    }
  };

  const isDisabled = useMemo(() => {
    if (kind === 'cancel_order') {
      return !modalConfirm.data?.orderId || !reason;
    }

    return false;
  }, [kind, modalConfirm.data?.orderId, reason]);

  const modalConfig = useMemo(() => getModalConfig(kind), [kind, groupInfo]);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setRemainingTime(90);
    }
  }, [isOpen]);

  // Close modal after timer ends
  useEffect(() => {
    if (remainingTime <= 0) {
      setModalConfirm({ isOpen: false });

      return;
    }

    if (kind === 'qr_code') {
      timerRef.current = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [remainingTime, kind]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Modal
      backdrop="blur"
      isDismissable={false}
      isOpen={isOpen}
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
          {kind !== 'qr_code' && (
            <Alert
              color={modalConfig?.alertStatus}
              title={modalConfig?.description}
            />
          )}
          {kind === 'cancel_order' && (
            <MyTextarea
              isRequired
              label={t('confirm_modal.cancel_order.reason')}
              labelPlacement="outside"
              maxLength={255}
              placeholder={t('confirm_modal.cancel_order.reason_placeholder')}
              value={reason}
              onChange={(e) => setReason(e.target.value?.trim())}
            />
          )}
          {kind === 'qr_code' && (
            <div className="bg-primary-400 rounded-2xl p-6 flex flex-col justify-center mx-auto w-full max-w-screen-sm">
              <div className="text-md font-bold text-center mb-2 text-white">
                {DateHelper.formatTime(remainingTime)}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md w-fit mx-auto">
                <QRCodeSVG
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  imageSettings={{
                    src: '/images/logo.webp',
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                  }}
                  level="H"
                  size={256}
                  value={modalConfirm.data?.qrCode}
                />
              </div>
              <div className="text-center text-white mt-4">
                {t('order_modal.scan_with_bank_app')}
              </div>
            </div>
          )}
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
            isDisabled={isDisabled}
            isLoading={
              isPendingLock ||
              isPendingDelete ||
              isPendingConfirmPaid ||
              isPendingCancelOrder ||
              isPendingMarkPaid
            }
            onPress={modalConfig?.onConfirm}
          >
            {modalConfig?.confirmText}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
