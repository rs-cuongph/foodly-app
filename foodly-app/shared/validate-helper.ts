import { template } from "lodash";
import * as yup from "yup";

import { REGEX_VALIDATE } from "./regex-validate";

const MESSAGES = {
  MSG_001: "${field} cannot be empty",
  MSG_002: "${field} needs to be a valid email",
  MSG_003: "${field} needs to be less than ${max}",
  MSG_004: "${field} needs to be less than ${min}",
  MSG_005: "${field} is not support Emoji",
  MSG_006: "${field} needs to be number",
  MSG_007:
    "${field} needs to be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
  MSG_008: "${field} needs to be select",
  MSG_009: "${field} doesn't match with ${field2}",
};

const LABEL = {
  email: "Email",
  password: "Password",
  confirm_password: "Confirm password",
  display_name: "Display name",
};

function getValue(obj: Record<string, any>, keyString?: string) {
  if (!keyString) return "";
  const keys = keyString.split(".");
  let value = obj;

  for (let i = 0; i < keys.length; i++) {
    value = value?.[keys[i]];
  }

  return value;
}

const defaultMessage = {
  mixed: {
    required: ({ label }: { label: string }) => {
      const field = getValue(LABEL, label);
      const compiled = template(MESSAGES.MSG_001);

      return compiled({ field });
    },
  },
  string: {
    max: ({
      label,
      max,
      errorMsg,
    }: {
      label: string;
      max: number;
      errorMsg?: string;
    }) => {
      const field = getValue(LABEL, label);
      const compiled = template(errorMsg || MESSAGES.MSG_003);

      return compiled({ field, max });
    },
  },
};

yup.setLocale(defaultMessage);

export const getMessageAddMethod = {
  password: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_007);

    return compiled({ field });
  },
  email: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_002);

    return compiled({ field });
  },
  noEmoji: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_005);

    return compiled({ field });
  },
  isNumber: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_006);

    return compiled({ field });
  },
  requireSelect: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_008);

    return compiled({ field });
  },
  sameAs: (current: any, target: string) => {
    const { label } = current;
    const field = getValue(LABEL, label);
    const field2 = getValue(LABEL, target).toLowerCase();
    const compiled = template(MESSAGES.MSG_009);

    return compiled({ field, field2 });
  },
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  "requireSelect",
  function (this, errorMsg?: string) {
    return this.test(
      "requireSelect",
      errorMsg || getMessageAddMethod.requireSelect,
      function (value) {
        const { path, createError } = this;

        return (
          !!value ||
          createError({
            path,
            message: errorMsg || getMessageAddMethod.requireSelect,
          })
        );
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "noEmoji",
  function (this, errorMsg?: string) {
    return this.test(
      "noEmoji",
      errorMsg || getMessageAddMethod.noEmoji,
      function (input) {
        if (!input) return true;

        const regexEmoji = new RegExp(REGEX_VALIDATE.EMOJI);

        return !regexEmoji.test(input);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "password",
  function (this, errorMsg?: string) {
    return this.test(
      "password",
      errorMsg || getMessageAddMethod.password,
      function (input) {
        if (!input) return true;

        const regexPassword = new RegExp(REGEX_VALIDATE.PASSWORD);

        return regexPassword.test(input);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "email",
  function (this, errorMsg?: string) {
    return this.test(
      "email",
      errorMsg || getMessageAddMethod.email,
      function (input) {
        if (!input) return true;
        const regex = new RegExp(REGEX_VALIDATE.EMAIL);

        return regex.test(input);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "sameAs",
  function (this: yup.StringSchema, field: string, errorMsg: string) {
    return this.test(
      "sameAs",
      (current) => {
        return errorMsg ?? getMessageAddMethod.sameAs(current, field);
      },
      function (value) {
        if (!value) return true;

        return value === this.parent[field];
      },
    );
  },
);

export default yup;
