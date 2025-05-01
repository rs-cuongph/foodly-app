'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import MyButton from '@/components/atoms/Button';
import AddPaymentModal from '@/components/organisms/my-page/add-payment';
import ChangeDisplayNameModal from '@/components/organisms/my-page/change-display-name';
import ChangePasswordModal from '@/components/organisms/my-page/change-password';
import { useUpdateUserInfoMutation } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useAuthStore } from '@/stores/auth';

export default function MyPage() {
  const t = useTranslations();
  const { showError, showSuccess } = useSystemToast();
  const { userInfo, paymentSettings, setPaymentSetting } = useAuthStore();
  const [isOpenAddPaymentModal, setIsOpenAddPaymentModal] = useState(false);
  const [isOpenChangeDisplayNameModal, setIsOpenChangeDisplayNameModal] =
    useState(false);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] =
    useState(false);
  const { mutateAsync: updateUserInfo } = useUpdateUserInfoMutation();

  const handleDeletePaymentSetting = async (index: number) => {
    try {
      await updateUserInfo({
        payment_setting: paymentSettings().filter((_, i) => i !== index),
      });
      setPaymentSetting(paymentSettings().filter((_, i) => i !== index));
      showSuccess(t('system_message.success.delete_payment_setting'));
    } catch (error) {
      handleErrFromApi(error, undefined, showError);
    }
  };

  return (
    <div className="">
      <div className="flex md:flex-row flex-col gap-2">
        <div className="basic-info bg-white w-full md:w-1/2 max-w-[600px] min-h-[200px] rounded-lg p-4">
          <p className="text-lg font-bold capitalize">
            {t('my_page.basic_info.title')}
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className=" bg-white flex flex-col gap-2">
              <div className="text-md flex flex-row gap-2 w-full items-center">
                <div className="font-semibold min-w-[110px]">
                  {t('my_page.basic_info.display_name')}
                </div>
                <span className="font-md line-clamp-1">
                  {userInfo?.display_name}
                </span>
                <MyButton
                  className="ml-4"
                  radius="full"
                  size="sm"
                  onPress={() => setIsOpenChangeDisplayNameModal(true)}
                >
                  {t('my_page.basic_info.change')}
                </MyButton>
              </div>
              <div className="text-md flex flex-row gap-2 w-full items-center">
                <div className="font-semibold min-w-[110px]">
                  {t('my_page.basic_info.email')}
                </div>
                <span className="font-md line-clamp-1">{userInfo?.email}</span>
              </div>
              <div className="text-md flex flex-row gap-2 w-full items-center">
                <div className="font-semibold min-w-[110px]">
                  {t('my_page.basic_info.password')}
                </div>{' '}
                <span className="font-md">********</span>
                <MyButton
                  className="ml-4"
                  radius="full"
                  size="sm"
                  onPress={() => setIsOpenChangePasswordModal(true)}
                >
                  {t('my_page.basic_info.change')}
                </MyButton>
              </div>
            </div>
          </div>
        </div>
        <div className="setting-payment bg-white w-full md:w-1/2 max-w-[400px] min-h-[200px] rounded-lg p-4">
          <p className="text-lg font-bold capitalize">
            {t('my_page.payment_settings.title')}
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-col gap-2 mb-2">
              {paymentSettings().map((payment, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 items-center bg-primary-50 rounded-full px-4 py-2 w-full max-w-[360px] justify-between"
                >
                  <p className="text-sm font-semibold">
                    <span className="capitalize">{payment.payment_method}</span>{' '}
                    | {payment.account_number}
                  </p>
                  <MyButton
                    isIconOnly={true}
                    size="sm"
                    variant="light"
                    onPress={() => handleDeletePaymentSetting(index)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </MyButton>
                </div>
              ))}
            </div>
            {paymentSettings().length < 3 && (
              <MyButton
                className="max-w-[100px]"
                radius="sm"
                size="sm"
                onPress={() => setIsOpenAddPaymentModal(true)}
              >
                {t('my_page.payment_settings.add')}
              </MyButton>
            )}
          </div>
        </div>
      </div>
      <ChangeDisplayNameModal
        isOpen={isOpenChangeDisplayNameModal}
        onClose={() => setIsOpenChangeDisplayNameModal(false)}
      />
      <AddPaymentModal
        isOpen={isOpenAddPaymentModal}
        onClose={() => setIsOpenAddPaymentModal(false)}
      />
      <ChangePasswordModal
        isOpen={isOpenChangePasswordModal}
        onClose={() => setIsOpenChangePasswordModal(false)}
      />
    </div>
  );
}
