import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import yup from "@/shared/validate/yup-base";
import { SHARE_SCOPE } from "@/shared/constants";

type FormCreateRoomType = {
  name: string;
  public_time?: string;
  is_same_price: boolean;
  is_link_menu: string;
  share_scope: SHARE_SCOPE;
  save_as_template: boolean;
  link: string;
  price?: number;
  invited_people: [] | string[];
  list_menu: {
    name: string;
    price: number;
  }[];
};

type FormEditRoomType = {
  id: string;
  name: string;
  public_time?: string;
  price?: number;
  share_scope: SHARE_SCOPE;
  save_as_template: boolean;
  invited_people: [] | string[];
};

const useCreateRoomForm = () => {
  const validationScheme = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().label("room.name").max(255).required(),
        is_same_price: yup.boolean(),
        public_time: yup.string().label("room.public_time").required(),
        link: yup
          .string()
          .label("room.link")
          .when("is_link_menu", {
            is: (value?: any) => {
              if (value == "2") return true;

              return false;
            },
            then(schema) {
              return schema.required();
            },
          }),
        price: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .nullable()
          .label("room.price"),
        share_scope: yup.string().label("room.share_scope").required(),
        invited_people: yup
          .array()
          .of(yup.string())
          .label("room.invited_people"),
        list_menu: yup.array().when("is_link_menu", {
          is: (value?: any) => {
            if (value == "2") return false;

            return true;
          },
          then: (schema) =>
            schema
              .of(
                yup.object({
                  name: yup
                    .string()
                    .label("room.list_menu.name")
                    .max(255)
                    .required(),
                  price: yup
                    .number()
                    .transform((value) => (isNaN(value) ? undefined : value))
                    .nullable()
                    .label("room.list_menu.price")
                    .required(),
                }),
              )
              .required(),
        }),
      }),
    [],
  );

  return useForm<FormCreateRoomType>({
    resolver: yupResolver(validationScheme) as any,
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      public_time: undefined,
      is_link_menu: "1",
      price: 0,
      link: "",
      share_scope: SHARE_SCOPE.PUBLIC,
      invited_people: [],
      list_menu: [{ name: "", price: 0 }],
      save_as_template: false,
    },
  });
};

export { useCreateRoomForm };
export type { FormCreateRoomType, FormEditRoomType };
