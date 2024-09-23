import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import yup from "@/shared/validate-helper";

export type SignUpSchemaType = {
  email: string;
  password: string;
  confirm_password: string;
  display_name?: string | null;
};

const SignUpSchema = yup.object().shape({
  email: yup.string().label("email").required().email().max(255).trim(),
  password: yup.string().label("password").required().max(255).trim(),
  confirm_password: yup
    .string()
    .label("confirm_password")
    .required()
    .sameAs("password")
    .max(255)
    .trim(),
  display_name: yup.string().label("display_name").nullable().max(255).trim(),
});

const useSignUpForm = () => {
  const form = useForm<SignUpSchemaType>({
    mode: "onChange",
    resolver: yupResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      display_name: null,
    },
  });

  return form;
};

export default useSignUpForm;
