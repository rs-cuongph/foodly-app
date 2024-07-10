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
import { Icon } from "@iconify/react";

import { FormCreateRoomType, useCreateRoomForm } from "./validate";

import { SHARE_SCOPE } from "@/shared/constants";
import ControlledInput from "@/components/atoms/ControlledInput";
import { commonState } from "@/provider/common";
import { Room } from "@/types/room";
import { roomState } from "@/provider/room";
import ControlledCheckbox from "@/components/atoms/ControlledCheckbox";
import ControlledRadioGroup from "@/components/atoms/ControlledRadioGroup";
import ControlledDateRangePicker from "@/components/atoms/ControlledDateRangePicker";

interface CreateRoomProps {
  editData?: Room;
}

export default function ModalCreateRoom({ editData }: CreateRoomProps) {
  const showLoading = commonState((state) => state.showLoading);
  const [mode, setMode] = useState(false);
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
    register,
    getValues,
    handleSubmit,
  } = form;
  const { errors } = formState;
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);

  console.log(errors);

  const onClose = () => {
    setOpenModalCreateRoom(false);
  };

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "list_menu",
  });

  const isInputLink = useMemo(() => {
    if (getValues("is_link_menu") === "1") return true;

    return false;
  }, [watch("is_link_menu")]);

  useEffect(() => {
    if (isInputLink) {
      setValue("link", "");
    }
  }, [isInputLink]);

  useEffect(() => {
    if (getValues("is_same_price")) {
      fields.forEach((field, index) => {
        update(index, {
          price: getValues("price") ?? 0,
          name: watch("list_menu")[0].name,
        });
      });
    } else {
      fields.forEach((field, index) => {
        update(index, {
          price: 0,
          name: watch("list_menu")[0].name,
        });
      });
    }
  }, [watch("is_same_price"), fields.length, watch("price")]);

  const onSubmit = async (values: FormCreateRoomType) => {
    showLoading();
    // Todo
    hideLoading();
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
          description: editData.description,
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
      <Modal backdrop="blur" isOpen={open} size="2xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <form
                className="modal-create-group-element"
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
                      className="max-w-xs"
                      control={control}
                      errorMessage={errors?.public_time?.message}
                      formField="public_time"
                      label="Ngày"
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
                            description: "lấy data từ shoppe",
                            value: "1",
                            label: "Link",
                          },
                          {
                            description: "Nhập tự động",
                            value: "2",
                            label: "Manual",
                          },
                        ]}
                        orientation="horizontal"
                      />
                    </div>
                  </div>
                  {isInputLink ? (
                    <ControlledInput
                      control={control}
                      errorMessage={errors?.link?.message}
                      formField="link"
                      label="Link đường dẫn"
                      type="url"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <ControlledCheckbox
                        color="primary"
                        control={control}
                        formField={"is_same_price"}
                      >
                        Chọn đồng giá
                      </ControlledCheckbox>
                      {!mode && (
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

                  <div className="overflow-x-hidden overflow-y-auto max-h-[200px] gap-3 flex flex-col">
                    {isInputLink
                      ? null
                      : fields.map((field, index) => (
                          <div key={field.id} className="gap-3 flex flex-col">
                            <div className="flex items-center justify-center">
                              <ControlledInput
                                control={control}
                                endContent={
                                  <div className="flex items-center justify-center absolute bottom-0 right-0 top-0">
                                    <ControlledInput
                                      className="w-[200px]"
                                      control={control}
                                      disabled={getValues("is_same_price")}
                                      formField={`list_menu.${index}.price`}
                                      label={"Giá"}
                                      labelPlacement="inside"
                                      maxLength={7}
                                      radius={
                                        fields.length == 1 ? "md" : "none"
                                      }
                                      type="text"
                                      onChange={(value) => {
                                        let _value = value.replace(
                                          /[^0-9]/g,
                                          "",
                                        );

                                        if (!_value?.length) _value = "0";
                                        if (parseInt(_value) > 1000000)
                                          _value = "1000000";
                                        setValue(
                                          `list_menu.${index}.price`,
                                          parseInt(_value),
                                        );
                                      }}
                                    />
                                    {fields.length > 1 ? (
                                      <button
                                        className="p-2 cursor-pointer h-full flex items-center"
                                        onClick={() => remove(index)}
                                      >
                                        <Icon
                                          className="red"
                                          icon="clarity:remove-solid"
                                        />
                                      </button>
                                    ) : (
                                      <div />
                                    )}
                                  </div>
                                }
                                errorMessage={
                                  errors?.list_menu &&
                                  errors?.list_menu[index]?.name?.message
                                }
                                formField={`list_menu.${index}.name`}
                                label="Món ăn"
                                type="text"
                              />
                            </div>
                          </div>
                        ))}
                  </div>
                  <div className="text-right">
                    {isInputLink ? (
                      <Button color="default" isLoading={false} type="submit">
                        Lấy data
                      </Button>
                    ) : (
                      <button
                        className="text-blue-500 text-base cursor-pointer"
                        onClick={() =>
                          append({
                            name: "",
                            price: getValues("is_same_price")
                              ? getValues("price") || 0
                              : 0,
                          })
                        }
                      >
                        Thêm
                      </button>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter className="modal-create-group-footer-element">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Đóng
                  </Button>
                  <Button color="primary" isLoading={false} type="submit">
                    Lưu
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
