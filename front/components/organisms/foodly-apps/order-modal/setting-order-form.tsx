'use client';
import { Form } from '@heroui/form';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SettingOrderSchemaType } from './yup-form/setting-order.yup';

import MyCheckBoxController from '@/components/atoms/controller/MyCheckBox';
import { SquareMinusIcon, SquarePlusIcon } from '@/components/atoms/icons';
import { commaFormat } from '@/shared/helper/format';
import { useGroupStore } from '@/stores/group';

export interface SettingOrderFormRef {}

export interface SettingOrderFormProps {
  methods: UseFormReturn<SettingOrderSchemaType, any, SettingOrderSchemaType>;
}
const MAX_QUANTITY = 20;
const MIN_QUANTITY = 1;
const SettingOrderForm = forwardRef<SettingOrderFormRef, SettingOrderFormProps>(
  (props, ref) => {
    const t = useTranslations();
    const { methods } = props;
    const { control, getValues, setValue, formState, watch } = methods;
    const formRef = useRef<HTMLFormElement>(null);
    const { groupInfo } = useGroupStore();
    const { errors } = formState;
    const quantity = watch('quantity');

    const handlePlus = () => {
      const quantity = getValues('quantity');

      if (quantity && quantity < MAX_QUANTITY) {
        setValue('quantity', quantity + 1);
      }
    };

    const handleMinus = () => {
      const quantity = getValues('quantity');

      if (quantity && quantity > MIN_QUANTITY) {
        setValue('quantity', quantity - 1);
      }
    };

    const isSamePrice = useMemo(() => {
      return groupInfo?.is_same_price;
    }, [groupInfo]);

    const menuItems = useMemo(() => {
      return groupInfo?.menu_items.map((item) => ({
        label: `${item.name} - ${commaFormat(Number(item.price))}`,
        key: item.id,
      }));
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
              <span className="text-md ">{t('order_modal.menu')}:</span>{' '}
              {isSamePrice && (
                <span className="text-md text-danger-400">
                  ({t('order_modal.same_price')}{' '}
                  {commaFormat(Number(groupInfo?.price))})
                </span>
              )}
            </p>
            <div className="mt-4">
              <MyCheckBoxController
                checkBoxClassNames={{
                  label: 'text-md font-medium',
                }}
                control={control}
                gridColumn={2}
                name="menu"
                options={menuItems ?? []}
              />
            </div>
          </div>
          <div>
            <p>
              <span className="text-md ">{t('order_modal.quantity')}:</span>{' '}
            </p>
            <div className="ml-4 mt-4">
              <div className="flex flex-row items-center border border-primary rounded-xl w-fit px-2 py-1">
                <button className="cursor-pointer" onClick={handleMinus}>
                  <SquareMinusIcon
                    className={clsx('h-8 w-8 text-primary', {
                      'text-primary-200': quantity === MIN_QUANTITY,
                    })}
                  />
                </button>
                <input
                  className="w-[50px] outline-none text-center font-bold"
                  max={20}
                  maxLength={2}
                  value={quantity ?? ''}
                  onBlur={() => {
                    const value = getValues('quantity');

                    if (value === null) {
                      setValue('quantity', MIN_QUANTITY);

                      return;
                    }

                    if (value > MAX_QUANTITY) {
                      setValue('quantity', MAX_QUANTITY);
                    } else if (value < MIN_QUANTITY) {
                      setValue('quantity', MIN_QUANTITY);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value?.trim();

                    if (value === '') {
                      setValue('quantity', null);
                    }

                    if (!isNaN(parseInt(value))) {
                      setValue('quantity', parseInt(value));
                    }
                  }}
                />
                <button className="cursor-pointer" onClick={handlePlus}>
                  <SquarePlusIcon
                    className={clsx('h-8 w-8 text-primary', {
                      'text-primary-200': quantity === MAX_QUANTITY,
                    })}
                  />
                </button>
              </div>
            </div>
          </div>
          {/* <MyInput
            isRequired
            label={t('sign_in_modal.organization_code')}
            labelPlacement="outside"
            maxLength={40}
            placeholder={t('sign_in_modal.placeholder.organization_code')}
            type="text"
            {...register('organization_code')}
            disabled={!!organizationCode}
            errorMessage={errors.organization_code?.message}
            readOnly={!!organizationCode}
          />
          <MyInput
            isRequired
            label={t('sign_in_modal.email')}
            labelPlacement="outside"
            maxLength={255}
            placeholder={t('sign_in_modal.placeholder.email')}
            type="email"
            {...register('email')}
            errorMessage={errors.email?.message}
          />
          <InputPassword
            isRequired
            label={t('sign_in_modal.password')}
            labelPlacement="outside"
            maxLength={255}
            placeholder={t('sign_in_modal.placeholder.password')}
            {...register('password')}
            errorMessage={errors.password?.message}
          /> */}
        </div>
      </Form>
    );
  },
);

SettingOrderForm.displayName = 'SettingOrderForm';

export default SettingOrderForm;
