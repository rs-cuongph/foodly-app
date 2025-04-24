'use client';
import { Form } from '@heroui/form';
import { capitalize } from 'lodash';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SettingOrderSchemaType } from './yup-form/setting-order.yup';

import MySelectController from '@/components/atoms/controller/MySelectController';
import MyTextareaController from '@/components/atoms/controller/MyTextareaController';
import { useGroupStore } from '@/stores/group';

export interface SettingPaymentFormRef {}

export interface SettingPaymentFormProps {
  methods: UseFormReturn<SettingOrderSchemaType, any, SettingOrderSchemaType>;
}

const SettingPaymentForm = forwardRef<
  SettingPaymentFormRef,
  SettingPaymentFormProps
>((props, ref) => {
  const t = useTranslations();
  const { methods } = props;
  const { control, getValues, setValue, formState, watch } = methods;
  const formRef = useRef<HTMLFormElement>(null);
  const { groupInfo } = useGroupStore();
  const { errors } = formState;

  const paymentMethods = useMemo(() => {
    return (
      groupInfo?.created_by?.payment_setting.map((item) => ({
        key: JSON.stringify(item),
        label: capitalize(item.payment_method),
      })) ?? []
    );
  }, [groupInfo]);

  return (
    <Form
      ref={formRef}
      className="w-full flex flex-col"
      validationBehavior="aria"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="w-full flex flex-col gap-4">
        <div>
          <p>
            <span className="text-md ">{t('order_modal.note')}:</span>
          </p>
          <div className="mt-4">
            <MyTextareaController
              control={control}
              isClearable={false}
              label={''}
              labelPlacement="outside"
              maxLength={500}
              minRows={4}
              name="note"
              placeholder={t('order_modal.note_placeholder')}
            />
          </div>
        </div>
        <div>
          <p>
            <span className="text-md ">{t('order_modal.payment_method')}:</span>
          </p>
          <div className="mt-4">
            <MySelectController
              className="w-[250px]"
              control={control}
              name="payment_setting"
              options={paymentMethods}
              placeholder={t('order_modal.payment_method_placeholder')}
            />
          </div>
        </div>
      </div>
    </Form>
  );
});

SettingPaymentForm.displayName = 'SettingPaymentForm';

export default SettingPaymentForm;
