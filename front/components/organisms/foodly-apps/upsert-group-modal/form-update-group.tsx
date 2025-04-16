'use client';
import { Form } from '@heroui/form';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useFieldArray } from 'react-hook-form';

import useUpdateGroupForm, {
  UpdateGroupSchemaType,
} from './yup-form/update.yup';

import { MyButton } from '@/components/atoms/Button';
import MyCheckBoxController from '@/components/atoms/controller/MyCheckBox';
import MyDateRangePickerController from '@/components/atoms/controller/MyDateRangePickerController';
import MyInputController from '@/components/atoms/controller/MyInputController';
import MyRadioController from '@/components/atoms/controller/MyRadioController';
import MySelectController from '@/components/atoms/controller/MySelectController';
import {
  AnonymousIcon,
  CloseIcon,
  HomeShareIcon,
  SquarePlusIcon,
} from '@/components/atoms/icons';
import {
  GROUP_TYPE_ENUM,
  SHARE_SCOPE_ENUM,
  STORAGE_KEYS,
} from '@/config/constant';
import {
  useGetGroupQuery,
  useUpdateGroupMutation,
} from '@/hooks/api/apps/foodly/group';
import { UpdateGroupParams } from '@/hooks/api/apps/foodly/group/type';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { ModalType, useCommonStore } from '@/stores/common';

interface UpdateGroupFormRef {
  handleSubmit: () => void;
}

interface UpdateGroupFormProps {}

const UpdateGroupForm = forwardRef<UpdateGroupFormRef, UpdateGroupFormProps>(
  (props, ref) => {
    const t = useTranslations();
    const { id } = useParams<{ id: string | undefined }>();
    const { setIsLoadingConfirm, closeModal } = useCommonStore();
    const { showError, showSuccess } = useSystemToast();
    const { data: groupInfoRes } = useGetGroupQuery(
      id!,
      {
        invite_code: localStorage.getItem(STORAGE_KEYS.GROUP_INVITE_CODE) ?? '',
      },
      true,
    );
    const {
      control,
      watch,
      handleSubmit,
      formState: { errors },
      reset,
      setError,
      setValue,
      getValues,
    } = useUpdateGroupForm();
    const { mutateAsync: updateGroup } = useUpdateGroupMutation(id!);
    const formRef = useRef<HTMLFormElement>(null);
    const {
      fields: menuItems,
      append: appendMenu,
      remove: removeMenu,
      update: updateMenu,
    } = useFieldArray({
      control,
      name: 'menu_items',
    });

    const [minStartDate, setMinStartDate] = useState<string>('');

    const wType = watch('type');
    const wIsSamePrice = watch('is_same_price');

    const shareScopeOptions = [
      {
        key: SHARE_SCOPE_ENUM.PUBLIC,
        label: t('common.share_scope.public'),
        startContent: <HomeShareIcon className="w-5 h-5 text-primary" />,
      },
      {
        key: SHARE_SCOPE_ENUM.PRIVATE,
        label: t('common.share_scope.private'),
        startContent: <AnonymousIcon className="w-5 h-5 text-primary" />,
      },
    ];

    const typeOptions = [
      {
        key: GROUP_TYPE_ENUM.MANUAL,
        label: t('upsert_group_modal.manual'),
      },
      // TODO: add auto type
      // {
      //   key: GROUP_TYPE_ENUM.AUTO,
      //   label: tCreateGroupModal('auto'),
      // },
    ];
    const onChangeSamePrice = () => {
      const isSamePrice = getValues('is_same_price');
      const menuItems = getValues('menu_items');
      const price = getValues('price');

      if (isSamePrice.includes('1')) {
        menuItems.forEach((menu, index) => {
          updateMenu(index, { name: menu.name, price: null });
        });
        setValue('price', menuItems[0].price);
      } else {
        menuItems.forEach((menu, index) => {
          updateMenu(index, { name: menu.name, price: price });
        });
        setValue('price', 0);
      }
    };

    const onRemoveMenuItem = (index: number) => {
      const item = menuItems[index];

      if (item.id) {
        setValue('menu_items_deleted', [
          ...getValues('menu_items_deleted'),
          item.id,
        ]);
      }

      removeMenu(index);
    };

    // Handle submit form
    const onSubmit = async (data: UpdateGroupSchemaType) => {
      const params: UpdateGroupParams = {
        id: id!,
        name: data.name,
        public_start_time: data.date_range.start as string,
        public_end_time: data.date_range.end,
        share_scope: data.share_scope,
        type: data.type,
        price: Number(data.price),
        is_save_template: false,
        menu_items: [
          ...data.menu_items.map((menu) => ({
            id: menu?.id ?? undefined,
            name: menu.name,
            price: Number(menu.price),
          })),
          ...getValues('menu_items_deleted').map((id) => ({
            id,
            _destroy: true,
          })),
        ],
        invite_code: localStorage.getItem(STORAGE_KEYS.GROUP_INVITE_CODE) ?? '',
      };

      if (data.is_same_price.includes('1')) {
        params.price = Number(data.price);
        params.menu_items = params.menu_items
          .filter((m) => !m?._destroy)
          .map((menu) => ({
            id: menu.id,
            name: 'name' in menu ? menu.name : '',
            price: 0,
          }));
      } else {
        params.price = 0;
        params.menu_items = data.menu_items
          // Only include items that aren't marked for deletion and have a name
          .filter((menu) => !menu?._destroy)
          .map((menu) => ({
            name: 'name' in menu ? menu.name : '',
            price: Number(menu.price || 0),
          }));
      }
      try {
        setIsLoadingConfirm(true, ModalType.CREATE_GROUP);
        await updateGroup(params);
        showSuccess(t('system_message.success.update_group_success'));
        closeModal(ModalType.CREATE_GROUP);
      } catch (error) {
        handleErrFromApi(error, setError, showError);
      } finally {
        setIsLoadingConfirm(false, ModalType.CREATE_GROUP);
      }
    };

    const renderMenu = () => {
      return (
        <div className="flex flex-col">
          <div className="flex flex-col">
            {menuItems.map((menu, index) => (
              <div key={menu.id} className="flex flex-row gap-2 mb-2">
                <MyInputController
                  control={control}
                  errorMessage={errors.menu_items?.[index]?.name?.message}
                  label={''}
                  name={`menu_items.${index}.name`}
                  placeholder={t('upsert_group_modal.placeholder.menu_name')}
                />
                {!wIsSamePrice.includes('1') && (
                  <MyInputController
                    isNumber
                    className="w-[250px]"
                    control={control}
                    errorMessage={errors.menu_items?.[index]?.price?.message}
                    label={''}
                    maxValue={10000000}
                    minValue={1000}
                    name={`menu_items.${index}.price`}
                    placeholder={t('upsert_group_modal.placeholder.menu_price')}
                  />
                )}
                {menuItems.length > 1 && (
                  <MyButton
                    isIconOnly
                    className="w-fit"
                    color="danger"
                    variant="flat"
                    onPress={() => onRemoveMenuItem(index)}
                  >
                    <CloseIcon className="w-5 h-5 text-danger" />
                  </MyButton>
                )}
              </div>
            ))}
            {menuItems.length <= 20 && (
              <MyButton
                className="w-fit"
                color="primary"
                variant="flat"
                onPress={() =>
                  appendMenu({
                    name: '',
                    price: null,
                  })
                }
              >
                <SquarePlusIcon className="w-5 h-5 text-primary" />
                {t('upsert_group_modal.add_menu')}
              </MyButton>
            )}
          </div>
        </div>
      );
    };

    // expose handleSubmit to parent
    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    // Reset form when unmount
    useEffect(() => {
      if (!groupInfoRes) return;
      setMinStartDate(groupInfoRes.public_start_time);
      reset({
        name: groupInfoRes.name,
        price: groupInfoRes.price,
        is_same_price: Number(groupInfoRes.price ?? 0) > 0 ? ['1'] : [],
        share_scope: groupInfoRes.share_scope,
        type: groupInfoRes.type,
        date_range: {
          start: groupInfoRes.public_start_time,
          end: groupInfoRes.public_end_time,
        },
        menu_items: groupInfoRes.menu_items.map((menu) => ({
          id: menu.id,
          name: menu.name,
          price: menu.price,
        })),
        menu_items_deleted: [],
      });

      return () => {
        reset();
      };
    }, [groupInfoRes]);

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
          <MyInputController
            isRequired
            control={control}
            errorMessage={errors.name?.message}
            label={t('upsert_group_modal.name')}
            labelPlacement="outside"
            name="name"
            placeholder={t('upsert_group_modal.placeholder.name')}
          />

          <MyDateRangePickerController
            hideTimeZone
            isRequired
            control={control}
            description={t('upsert_group_modal.description.date_range')}
            errorMessage={
              errors.date_range?.start?.message ||
              errors.date_range?.end?.message
            }
            label={t('upsert_group_modal.date_range')}
            minValue={minStartDate}
            name="date_range"
          />

          <MyRadioController
            control={control}
            label={t('upsert_group_modal.type')}
            name="type"
            options={typeOptions}
            orientation="horizontal"
          />

          {wType === GROUP_TYPE_ENUM.MANUAL && renderMenu()}

          <div className="flex flex-row gap-2 items-start">
            <MyCheckBoxController
              className="mt-3"
              control={control}
              name="is_same_price"
              options={[
                {
                  key: '1',
                  label: t('upsert_group_modal.is_same_price'),
                },
              ]}
              onChange={onChangeSamePrice}
            />
            {wIsSamePrice.includes('1') && (
              <MyInputController
                isNumber
                className="w-[200px]"
                control={control}
                errorMessage={errors.price?.message}
                label={''}
                maxValue={10000000}
                minValue={1000}
                name="price"
                placeholder={t('upsert_group_modal.placeholder.price')}
              />
            )}
          </div>
          <MySelectController
            className="w-[200px]"
            control={control}
            label={t('upsert_group_modal.share_scope')}
            name="share_scope"
            options={shareScopeOptions}
          />
        </div>
      </Form>
    );
  },
);

UpdateGroupForm.displayName = 'UpdateGroupForm';

export default UpdateGroupForm;
