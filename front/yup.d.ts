import { yup } from "@utils/validate/yup_base";

declare module "yup" {
  interface StringSchema extends yup.StringSchema {
    email(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    validPassword(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    validPasswordLength(
      this: yup.StringSchema,
      errorMsg?: string,
    ): yup.StringSchema;
    validEmail(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    sameAs(
      this: yup.StringSchema,
      field: string,
      errorMsg?: string,
    ): yup.StringSchema;
    notEmoji(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    requiredSelect(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    isValidDate(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    onlyHiragana(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    maxPresent(this: yup.StringSchema, errorMsg?: string): yup.StringSchema;
    minDate(
      this: yup.StringSchema,
      field: string,
      errorMsg?: string,
    ): yup.StringSchema;
    isValidPhoneNumber(
      this: yup.StringSchema,
      errorMsg?: string,
    ): yup.StringSchema;
    convertDateToString(this: yup.StringSchema);
  }
  interface MixedSchema extends yup.MixedSchema {
    requiredSelect(this: yup.MixedSchema, errorMsg?: string): yup.MixedSchema;
  }
  interface ArraySchema extends yup.ArraySchema {
    transformFilterEmpty(this: yup.ArraySchema, defaultValue?: any[]);
  }
}
