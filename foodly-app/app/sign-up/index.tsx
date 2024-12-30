"use client";

import { Button, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import useSignUpForm, { SignUpSchemaType } from "@/hooks/form/sign-up-form";
import { SignUpAPI, SignUpPayload } from "@/services/auth/sign-up";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";

export function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSignUpForm();

  const [visible, setVisible] = useState({
    isVisiblePassword: false,
    isVisibleConfirmPassword: false
  });

  const signUpMutation = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: (data: SignUpPayload) => SignUpAPI(data),
    onSuccess: (res) => {
      if (res.access_token) {
        localStorage.setItem("ACCESS_TOKEN", res.access_token);
        signIn("tokenLogin", {
          ...res
        });
      }
    },
  });

  const toggleVisibility = (visiable: {
    isVisiblePassword?: boolean,
    isVisibleConfirmPassword?: boolean
  }) => setVisible((prev) => {
    return {
      ...prev,
      ...visiable
    }
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => {
    signUpMutation.mutate(data);
  };

  return (
    <section className="flex flex-col w-full max-w-[600px] mx-auto mt-10 rounded-2xl bg-white p-4 md:p-10">
      <h2 className="text-center mb-10 text-lg font-bold">SIGN UP</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <Input
            isRequired
            className=""
            label="Email"
            placeholder="cuongph@foodly.com"
            type="email"
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email?.message?.length}
          />
        </div>

        <div className="mt-4">
          <Input
            isRequired
            className=""
            label="Password"
            placeholder="******"
            type={visible.isVisiblePassword ? "text" : "password"}
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password?.message?.length}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility({ isVisiblePassword: !visible.isVisiblePassword })}
              >
                {visible.isVisiblePassword ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </div>

        <div className="mt-4">
          <Input
            isRequired
            className=""
            label="Confirm Password"
            placeholder="******"
            type={visible.isVisibleConfirmPassword ? "text" : "password"}
            {...register("confirm_password")}
            errorMessage={errors.confirm_password?.message}
            isInvalid={!!errors.confirm_password?.message?.length}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => { toggleVisibility({ isVisibleConfirmPassword: !visible.isVisibleConfirmPassword }) }}
              >
                {visible.isVisibleConfirmPassword ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </div>

        <div className="mt-4">
          <Input
            className=""
            label="Display Name"
            {...register("display_name")}
            errorMessage={errors.display_name?.message}
            isInvalid={!!errors.display_name?.message?.length}
          />
        </div>

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link className="text-sm font-bold" href={siteConfig.routes.login}>
            Sign In
          </Link>{" "}
          now
        </p>

        <div className="flex justify-center mt-10">
          <Button
            className=""
            color="primary"
            radius="md"
            size="lg"
            type="submit"
          >
            Sign Up Now
          </Button>
        </div>
      </form>
    </section>
  );
}
