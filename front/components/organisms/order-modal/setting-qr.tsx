'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SettingOrderSchemaType } from './yup-form/setting-order.yup';

import { CreateOrderResponse } from '@/hooks/api/order/type';
import { getVietQRCode } from '@/shared/helper/common';
import { ModalType, useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

export interface SettingQRRef {}

export interface SettingQRProps {
  methods: UseFormReturn<SettingOrderSchemaType, any, SettingOrderSchemaType>;
  qrCode: string | null;
  orderInfo: CreateOrderResponse | null;
}

const SettingQR = forwardRef<SettingQRRef, SettingQRProps>((props, ref) => {
  const t = useTranslations();
  const { methods, qrCode, orderInfo } = props;
  const { getValues, reset } = methods;
  const { groupInfo } = useGroupStore();
  const { closeModal } = useCommonStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(90); // 1 minute and 30 seconds

  const menuNames = useMemo(() => {
    if (!groupInfo) return '';
    const menuItems = groupInfo.menu_items.filter((item) =>
      getValues('menu').includes(item.id),
    );

    return menuItems.map((item) => item.name).join(' x ');
  }, [getValues, groupInfo]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const vietQRCode = useMemo(() => {
    const { account_name, account_number, payment_method } = JSON.parse(
      getValues('payment_setting'),
    );

    const amount = Number(orderInfo?.amount ?? 0);

    return getVietQRCode(
      payment_method,
      account_number,
      account_name,
      amount,
      qrCode ?? '',
    );
  }, [groupInfo, getValues, qrCode, orderInfo]);

  // Close modal after timer ends
  useEffect(() => {
    if (remainingTime <= 0) {
      closeModal(ModalType.UPSERT_ORDER);
      reset();

      return;
    }

    timerRef.current = setTimeout(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [remainingTime, closeModal]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!qrCode) {
    return (
      <div className="flex justify-center items-center p-6">
        {t('order_modal.qr_code_not_available')}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* QR code */}
      <div className="bg-primary-400 rounded-2xl p-6 flex flex-col justify-center mx-auto w-full max-w-screen-sm">
        <div className="text-md font-bold text-center mb-2 text-white">
          {formatTime(remainingTime)}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md w-fit mx-auto">
          {/* <QRCodeSVG
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
            value={qrCode}
          /> */}
          <Image
            alt="QR Code"
            className="w-full h-full"
            height={256}
            src={vietQRCode}
            width={256}
          />
        </div>
        <div className="text-center text-white mt-4">
          {t('order_modal.scan_with_bank_app')}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 text-center">
        {/* Product information */}
        <div className="mt-6 border-t pt-4">
          <div className="text-left text-lg font-semibold mb-2">
            {t('order_modal.product_info')}:
          </div>
          <div className="text-left font-medium">{menuNames}</div>
          <div className="mt-2 flex justify-start">
            <div className="text-gray-700">{t('order_modal.quantity')}: </div>
            <div className="font-medium ml-2">1</div>
          </div>
        </div>
      </div>
    </div>
  );
});

SettingQR.displayName = 'SettingQR';

export default SettingQR;
