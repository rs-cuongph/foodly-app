'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProvider } from 'react-hook-form';

import SettingOrderForm, { SettingOrderFormProps } from './setting-order-form';
import SettingPaymentForm from './setting-payment-form';
import SettingQR from './setting-qr';
import { OrderModalStep } from './step';
import useSettingOrderForm from './yup-form/setting-order.yup';

import { MyButton } from '@/components/atoms/Button';
import { useCreateOrderMutation, useMarkPaidMutation } from '@/hooks/api/order';
import { CreateOrderResponse } from '@/hooks/api/order/type';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { FormType, ModalType, useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

interface FormConfig {
  title: string;
  component: ForwardRefExoticComponent<
    SettingOrderFormProps &
      RefAttributes<any> & {
        qrCode: string | null;
        orderInfo: CreateOrderResponse | null;
      }
  >;
  showInNav?: boolean;
}
const box = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export default function OrderModal() {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const {
    modalUpsertOrder,
    closeModal,
    setIsOpen,
    setSelectedForm,
    setIsLoadingConfirm,
    setDataModalUpsertOrder,
  } = useCommonStore();
  const { groupInfo } = useGroupStore();
  const { showError, showSuccess } = useSystemToast();
  const { mutateAsync: markPaid } = useMarkPaidMutation();
  const { mutateAsync: createOrder } = useCreateOrderMutation();
  const methods = useSettingOrderForm();
  const { getValues, watch, setError, reset } = methods;
  const [buttonCancelText, setButtonCancelText] = useState(t('button.close'));
  const [buttonConfirmText, setButtonConfirmText] = useState(t('button.next'));
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<CreateOrderResponse | null>(null);
  const [step, setStep] = useState(1);
  const formRegistry: Record<string, FormConfig> = {
    [FormType.SETTING_ORDER]: {
      title: t('common.modal_title.create_order'),
      component: SettingOrderForm,
      showInNav: true,
    },
    [FormType.SETTING_PAYMENT]: {
      title: t('common.modal_title.create_order'),
      component: SettingPaymentForm,
      showInNav: true,
    },
    [FormType.QR_CODE]: {
      title: t('common.modal_title.create_order'),
      component: SettingQR,
      showInNav: true,
    },
  };

  const watchMenu = watch('menu');
  const watchPaymentSetting = watch('payment_setting');
  const watchQuantity = watch('quantity');

  const isDisabled = useMemo(() => {
    if (modalUpsertOrder.selectedForm === FormType.SETTING_ORDER) {
      return watchMenu.length === 0 || watchQuantity === 0;
    }

    if (modalUpsertOrder.selectedForm === FormType.SETTING_PAYMENT) {
      return watchPaymentSetting.length === 0;
    }

    return false;
  }, [
    watchMenu,
    watchQuantity,
    watchPaymentSetting,
    modalUpsertOrder.selectedForm,
  ]);

  const CurrentForm = formRegistry[modalUpsertOrder.selectedForm].component;

  const handleCancel = () => {
    if (modalUpsertOrder.selectedForm === FormType.SETTING_ORDER) {
      handleCloseModal();

      return;
    }

    if (modalUpsertOrder.selectedForm === FormType.SETTING_PAYMENT) {
      setSelectedForm(FormType.SETTING_ORDER, ModalType.UPSERT_ORDER);
      setButtonCancelText(t('button.close'));
      setButtonConfirmText(t('button.next'));
      setStep(1);

      return;
    }
  };

  const handleConfirm = async () => {
    if (isDisabled) return;

    if (modalUpsertOrder.selectedForm === FormType.SETTING_ORDER) {
      setSelectedForm(FormType.SETTING_PAYMENT, ModalType.UPSERT_ORDER);
      setButtonCancelText(t('button.back'));
      setButtonConfirmText(t('button.paid'));
      setStep(2);

      return;
    }

    if (modalUpsertOrder.selectedForm === FormType.SETTING_PAYMENT) {
      if (!groupInfo) return;

      try {
        setIsLoadingConfirm(true, ModalType.UPSERT_ORDER);
        const response = await createOrder({
          group_id: groupInfo.id,
          menu: getValues('menu').map((item) => ({ id: item })),
          quantity: getValues('quantity') || 1,
          note: getValues('note'),
          payment_setting: [JSON.parse(getValues('payment_setting'))],
        });

        showSuccess(t('system_message.success.create_order'));
        setOrderId(response.data.id);
        setQrCode(response.data.transaction.unique_code);
        setOrderInfo(response.data);
        setSelectedForm(FormType.QR_CODE, ModalType.UPSERT_ORDER);
        setButtonCancelText(t('button.close'));
        setButtonConfirmText(t('button.i_paid'));
        setStep(3);
      } catch (error) {
        handleErrFromApi(error, setError, showError);
      } finally {
        setIsLoadingConfirm(false, ModalType.UPSERT_ORDER);
      }

      return;
    }

    if (modalUpsertOrder.selectedForm === FormType.QR_CODE) {
      setIsLoadingConfirm(true, ModalType.UPSERT_ORDER);
      try {
        if (!orderId) return;

        await markPaid(orderId);
      } catch (error) {
        handleErrFromApi(error, setError, showError);
      } finally {
        closeModal(ModalType.UPSERT_ORDER);
      }
    }
  };

  const handleCloseModal = () => {
    reset({
      menu: [],
      quantity: 1,
      note: '',
      payment_setting: '',
    });
    setDataModalUpsertOrder(null);
    closeModal(ModalType.UPSERT_ORDER);
  };

  useEffect(() => {
    const { data, isOpen } = modalUpsertOrder;

    if (isOpen) {
      if (data) {
        reset({
          menu: data.menuItems.map((item: any) => item.id),
          quantity: data.quantity,
          note: data.note,
        });
      }
    }
  }, [modalUpsertOrder.isOpen]);

  useEffect(() => {
    const modal = searchParams.get('modal') as FormType;

    if (
      modal &&
      [FormType.SETTING_ORDER, FormType.SETTING_PAYMENT].includes(modal)
    ) {
      setIsOpen(true, ModalType.UPSERT_ORDER, modal);
    }

    return () => {
      setDataModalUpsertOrder(null);
    };
  }, []);

  return (
    <Modal
      backdrop="blur"
      isDismissable={false}
      isOpen={modalUpsertOrder.isOpen}
      size="3xl"
      onClose={handleCloseModal}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold">
            {formRegistry[modalUpsertOrder.selectedForm].title?.toUpperCase()}
          </h3>
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          <FormProvider {...methods}>
            <OrderModalStep step={step} />
            <AnimatePresence mode="wait">
              <motion.div
                key={modalUpsertOrder.selectedForm}
                animate="animate"
                exit="exit"
                initial="initial"
                variants={box}
              >
                <CurrentForm
                  ref={formRef}
                  methods={methods}
                  orderInfo={orderInfo}
                  qrCode={qrCode}
                />
              </motion.div>
            </AnimatePresence>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <MyButton variant="light" onPress={handleCancel}>
            {buttonCancelText}
          </MyButton>
          <MyButton
            disabled={isDisabled}
            isLoading={modalUpsertOrder.isLoadingConfirm}
            onPress={handleConfirm}
          >
            {buttonConfirmText}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
