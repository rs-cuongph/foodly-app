"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

import { FormCreateRoomType, useCreateRoomForm } from "./validate";

import { SHARE_SCOPE } from "@/shared/constants";
import ControlledInput from "@/components/atoms/ControlledInput";
import { commonState } from "@/provider/common";
import { Room } from "@/types/room";
import { roomState } from "@/provider/room";
import ControlledCheckbox from "@/components/atoms/ControlledCheckbox";
import ControlledRadioGroup from "@/components/atoms/ControlledRadioGroup";
import ControlledDateRangePicker from "@/components/atoms/ControlledDateRangePicker";
import ControlledSelect from "@/components/atoms/ControlledSelect";
import CustomIcon from "@/components/atoms/CustomIcon";

interface CreateRoomProps {
  editData?: Room;
}

export default function ModalCreateRoom({ editData }: CreateRoomProps) {
  const showLoading = commonState((state) => state.showLoading);
  const form = useCreateRoomForm();
  const usersState = roomState((state) => state.users);
  const open = roomState((state) => state.isOpenModalCreateOrder);
  const setOpenModalCreateRoom = roomState(
    (state) => state.setOpenModalCreateRoom,
  );
  const hideLoading = commonState((state) => state.hideLoading);

  const {
    formState,
    setValue,
    watch,
    reset,
    control,
    getValues,
    handleSubmit,
  } = form;
  const { errors } = formState;
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);

  const onClose = () => {
    setOpenModalCreateRoom(false);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "list_menu",
  });

  const isInputLink = useMemo(() => {
    if (getValues("is_link_menu") === "2") return true;

    return false;
  }, [watch("is_link_menu")]);

  const isSamePrice = useMemo(() => {
    return getValues("is_same_price");
  }, [watch("is_same_price")]);

  useEffect(() => {
    if (isInputLink) {
      setValue("link", "");
    }
  }, [isInputLink]);

  const onSubmit = async (values: FormCreateRoomType) => {
    console.log();

    showLoading();
    // Todo
    hideLoading();
  };

  const handleSearchLink = async () => {
    // Todo
  };

  useEffect(() => {
    setUsers(
      usersState.items.map((user) => ({
        label: user.username,
        value: user.id,
      })),
    );
  }, [usersState]);

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          name: editData.name,
          price: editData.price,
          public_time: undefined,
          share_scope: editData.share_scope as SHARE_SCOPE,
          invited_people: [],
        });
      } else {
        reset();
      }
    }
  }, [open]);

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={open}
        scrollBehavior="inside"
        size="2xl"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <form
              className="modal-create-group-element flex gap-3 flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ModalHeader className="flex flex-col gap-1 text-center">
                <div>{editData ? "Chỉnh Sửa" : "Tạo Mới"} </div>
              </ModalHeader>
              <ModalBody>
                <ControlledInput
                  control={control}
                  errorMessage={errors?.name?.message}
                  formField={"name"}
                  label="Tên nhóm"
                  type="text"
                />
                <div className="flex items-start gap-3">
                  <ControlledDateRangePicker
                    hideTimeZone
                    className="max-w-md"
                    control={control}
                    errorMessage={errors?.public_time?.message}
                    formField="public_time"
                    granularity="second"
                  />
                </div>
                <div className="flex justify-start gap-4 items-center">
                  <div>
                    <ControlledRadioGroup
                      control={control}
                      defaultValue="1"
                      formField="is_link_menu"
                      options={[
                        {
                          value: "1",
                          label: "Thủ công",
                        },
                        {
                          value: "2",
                          label: "Tự động",
                        },
                      ]}
                      orientation="horizontal"
                    />
                  </div>
                </div>
                {isInputLink && (
                  <div className="flex gap-3 items-center">
                    <ControlledInput
                      disabled
                      className="flex-1"
                      control={control}
                      errorMessage={errors?.link?.message}
                      formField="link"
                      label="URL"
                      type="url"
                    />
                    <Button
                      disabled
                      isIconOnly
                      className="text-xl cursor-pointer bg-[#fe724c] h-[56px] w-[56px]"
                      isLoading={false}
                      onClick={handleSearchLink}
                    >
                      <CustomIcon name="search" />
                    </Button>
                  </div>
                )}
                {isInputLink
                  ? null
                  : fields.map((field, index) => (
                      <div key={field.id} className="gap-3 flex flex-col">
                        <div className="flex items-baseline justify-center gap-3">
                          <ControlledInput
                            className="flex-[2]"
                            control={control}
                            errorMessage={
                              errors?.list_menu &&
                              errors?.list_menu[index]?.name?.message
                            }
                            formField={`list_menu.${index}.name`}
                            label="Món ăn"
                            type="text"
                          />
                          {!isSamePrice && (
                            <ControlledInput
                              className="flex-1"
                              control={control}
                              disabled={isSamePrice}
                              formField={`list_menu.${index}.price`}
                              label={"Giá"}
                              labelPlacement="inside"
                              maxLength={7}
                              type="text"
                              onChange={(value) => {
                                let _value = value.replace(/[^0-9]/g, "");

                                if (!_value?.length) _value = "0";
                                if (parseInt(_value) > 1000000)
                                  _value = "1000000";
                                setValue(
                                  `list_menu.${index}.price`,
                                  parseInt(_value),
                                );
                              }}
                            />
                          )}
                          {fields.length > 1 ? (
                            <CustomIcon
                              className="cursor-pointer"
                              name="remove"
                              onClick={() => remove(index)}
                            />
                          ) : (
                            <div />
                          )}
                        </div>
                      </div>
                    ))}
                <div className="text-left">
                  {!isInputLink && (
                    <Button
                      className="text-xl text-[#fff]"
                      color="primary"
                      isLoading={false}
                      onClick={() =>
                        append({
                          name: "",
                          price: isSamePrice ? getValues("price") ?? 0 : 0,
                        })
                      }
                    >
                      Thêm
                    </Button>
                  )}
                </div>
                {!isInputLink && (
                  <div className="flex items-center gap-3">
                    <ControlledCheckbox
                      color="primary"
                      control={control}
                      formField={"is_same_price"}
                    >
                      Đồng giá
                    </ControlledCheckbox>
                    {isSamePrice && (
                      <ControlledInput
                        className="w-[200px]"
                        control={control}
                        errorMessage={errors?.price?.message}
                        formField={"price"}
                        label={"Giá"}
                        labelPlacement="inside"
                        maxLength={7}
                        type="text"
                        onChange={(value) => {
                          let _value = value.replace(/[^0-9]/g, "");

                          if (!_value?.length) _value = "0";
                          if (parseInt(_value) > 1000000) _value = "1000000";
                          setValue("price", parseInt(_value));
                        }}
                      />
                    )}
                  </div>
                )}
                <ControlledSelect
                  control={control}
                  defaultSelectedKeys={["public"]}
                  formField="share_scope"
                  options={[
                    {
                      value: "public",
                      label: "Công khai",
                      icon: <CustomIcon name="public" />,
                    },
                    {
                      value: "limit",
                      icon: <CustomIcon name="private" />,
                      label: "Riêng tư",
                    },
                  ]}
                />
                <ControlledCheckbox
                  color="primary"
                  control={control}
                  formField={"save_as_template"}
                >
                  Lưu mẫu
                </ControlledCheckbox>
              </ModalBody>
              <ModalFooter className="modal-create-group-footer-element">
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" type="submit">
                  Xác nhận
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
