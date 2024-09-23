"use client";

import { Button, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";

import { siteConfig } from "@/config/site";
import useSignInForm, { SignInSchemaType } from "@/hooks/form/sign-in-form";

export function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSignInForm();

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const onSubmit: SubmitHandler<SignInSchemaType> = (data) => console.log(data);

  return (
    <section className="flex flex-col w-full max-w-[600px] mx-auto mt-10 rounded-2xl bg-white p-4 md:p-10">
      <h2 className="text-center mb-10 text-lg font-bold">SIGN IN</h2>
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
            type="password"
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password?.message?.length}
          />
        </div>
        <p className="text-sm text-center mt-5">
          Don&apos;t have an account ?{" "}
          <Link className="text-sm font-bold" href={siteConfig.routes.register}>
            Sign Up
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
            Sign In Now
          </Button>
        </div>
      </form>
    </section>
  );
}
