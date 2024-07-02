"use client";

import {
  Button,
  Divider,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { FormLoginType, useLoginForm } from "./validate";

export default function ModalLogin() {
  const form = useLoginForm();
  const [stateModalLogin, setStateModalLogin] = useState(true);
  const { formState, getValues, setValue, register, reset, watch } = form;
  const { errors } = formState;
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const onSubmit = async (values: FormLoginType) => {
    setStateModalLogin(false);
    // Todo Login and register
  };

  const onClose = () => {
    setStateModalLogin(false);
  };

  const handleChageModeRegester = () => {
    setValue("is_sign_in", !getValues("is_sign_in"));
  };

  useEffect(() => {
    reset({
      email: "",
      password: "",
      first_name: undefined,
      last_name: undefined,
      is_sign_in: getValues("is_sign_in"),
    });
  }, [watch("is_sign_in"), getValues]);

  return (
    <Modal
      backdrop="blur"
      isDismissable={false}
      isOpen={stateModalLogin}
      size={"lg"}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form className={""} onSubmit={form.handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1 text-center">
                {getValues("is_sign_in") ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
              </ModalHeader>
              <ModalBody>
                <div className="md:px-[25px] min-h-[200px]">
                  <div className="flex gap-6 py-4 items-center ">
                    <Button
                      className="w-full border-1"
                      radius="full"
                      startContent={<Icon icon="logos:google-icon" />}
                      variant="light"
                    >
                      Google
                    </Button>
                    <Button
                      className="w-full  border-1"
                      radius="full"
                      startContent={<Icon icon="logos:twitter" />}
                      variant="light"
                    >
                      Twitter
                    </Button>
                  </div>

                  <div className="flex gap-2 justify-center items-center py-4">
                    <Divider className="flex-1" />
                    Or continue with email
                    <Divider className="flex-1" />
                  </div>
                  <div className="flex gap-4 flex-col ">
                    <Input
                      description={""}
                      errorMessage={errors?.email?.message}
                      isInvalid={!!errors?.email?.message?.length}
                      isRequired={!getValues("is_sign_in")}
                      label={"Email"}
                      labelPlacement={"outside"}
                      placeholder="Nhập email"
                      type="email"
                      {...register("email")}
                    />
                    <Input
                      autoComplete="on"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => setIsVisible(!isVisible)}
                        >
                          {isVisible ? (
                            <Icon
                              className="h-5 w-5 text-gray-500"
                              icon="fa:eye-slash"
                            />
                          ) : (
                            <Icon
                              className="h-5 w-5 text-gray-500"
                              icon="fa:eye"
                            />
                          )}
                        </button>
                      }
                      errorMessage={errors?.password?.message}
                      isInvalid={!!errors?.password?.message?.length}
                      isRequired={!getValues("is_sign_in")}
                      label={"Mật khẩu"}
                      labelPlacement={"outside"}
                      placeholder="Nhập mật khẩu"
                      type={isVisible ? "text" : "password"}
                      {...register("password")}
                    />
                    {!getValues("is_sign_in") && (
                      <Input
                        autoComplete="on"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() => setIsVisible2(!isVisible2)}
                          >
                            {isVisible2 ? (
                              <Icon
                                className="h-5 w-5 text-gray-500"
                                icon="fa:eye-slash"
                              />
                            ) : (
                              <Icon
                                className="h-5 w-5 text-gray-500"
                                icon="fa:eye"
                              />
                            )}
                          </button>
                        }
                        errorMessage={errors?.re_password?.message}
                        isInvalid={!!errors?.re_password?.message?.length}
                        isRequired={!getValues("is_sign_in")}
                        label="Xác nhận mật khẩu"
                        labelPlacement={"outside"}
                        placeholder="Nhập lại mật khẩu"
                        type={isVisible2 ? "text" : "password"}
                        {...register("re_password")}
                      />
                    )}
                    {!getValues("is_sign_in") && (
                      <Input
                        className=""
                        errorMessage={errors?.first_name?.message}
                        isInvalid={!!errors?.first_name?.message?.length}
                        label="Họ và tên đệm"
                        labelPlacement={"outside"}
                        placeholder="Nhập họ và tên đệm"
                        type="text"
                        {...register("first_name")}
                      />
                    )}
                    {!getValues("is_sign_in") && (
                      <Input
                        label="Tên"
                        labelPlacement={"outside"}
                        placeholder="Nhập tên"
                        type="text"
                        {...register("last_name")}
                        errorMessage={errors?.last_name?.message}
                        isInvalid={!!errors?.last_name?.message?.length}
                      />
                    )}
                  </div>
                  <p className="mt-5 text-center text-[13px]">
                    {getValues("is_sign_in")
                      ? "Bạn không có tài khoản?"
                      : "Bạn đã có tài khoản?"}{" "}
                    <Link
                      className="text-[13px]"
                      href="#"
                      underline="none"
                      onPress={handleChageModeRegester}
                    >
                      {getValues("is_sign_in") ? "Đăng Ký" : "Đăng Nhập"}
                    </Link>{" "}
                    ngay bây giờ
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" isLoading={isLoading} type="submit">
                  {"Xác Nhận"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
