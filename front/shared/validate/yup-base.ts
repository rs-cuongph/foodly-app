import { template } from "lodash";
import * as yup from "yup";
import dayjs from "dayjs";
import IsSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { regexValidate } from "../constants/regex";

import { LABEL, MESSAGES } from "./message";
dayjs.extend(IsSameOrAfter);

export function getValue(obj: Record<string, any>, keyString?: string) {
  if (!keyString) return "";
  const keys = keyString.split(".");
  let value = obj;

  for (let i = 0; i < keys.length; i++) {
    value = value?.[keys[i]];
  }

  return value;
}

export function getErrorMessage(label: string, msgCode: string) {
  const field = getValue(LABEL, label);
  const compiled = template(msgCode);

  return compiled({ field });
}

export const getMessageAddMethod = {
  validPassword: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_006);

    return compiled({ field });
  },
  validPasswordLength: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_031);

    return compiled({ field });
  },
  validEmail: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_005);

    return compiled({ field });
  },
  notEmoji: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_010);

    return compiled({ field });
  },
  sameAs: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_009);

    return compiled({ field });
  },
  requiredSelect: ({ label }: any) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_002);

    return compiled({ field });
  },
  isValidDate: ({ label }: any) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_039);

    return compiled({ field });
  },
  onlyHiragana: ({ label }: any) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_032);

    return compiled({ field });
  },
  maxPresent: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_030);

    return compiled({ field });
  },
  isValidPhoneNumber: ({ label }: { label: string }) => {
    const field = getValue(LABEL, label);
    const compiled = template(MESSAGES.MSG_PHONE_NUMBER_2);

    return compiled({ field });
  },
  minDate: () => {
    const compiled = template(MESSAGES.MSG_043);

    return compiled();
  },
};

const defaultMessage = {
  mixed: {
    required: ({ label }: { label: string }) => {
      const field = getValue(LABEL, label);
      const compiled = template(MESSAGES.MSG_001);

      return compiled({ field });
    },
  },
  string: {
    min: ({ label, min }: { label: string; min: number }) => {
      const field = getValue(LABEL, label);
      const compiled = template(MESSAGES.MSG_004);

      return compiled({ field, min });
    },
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
    email: ({ label }: { label: string }) => {
      const field = getValue(LABEL, label);
      const compiled = template(MESSAGES.MSG_005);

      return compiled({ field });
    },
  },
  array: {
    min: ({ label, min }: { label: string; min: number }) => {
      if (!label) return MESSAGES.MSG_007;
      const field = getValue(LABEL, label);
      const compiled = template(MESSAGES.MSG_004);

      return compiled({ field, min });
    },
    max: ({ label, max }: { label: string; max: number }) => {
      const field = getValue(LABEL, label);
      const compiled = template(MESSAGES.MSG_003);

      return compiled({ field, max });
    },
  },
};

yup.setLocale(defaultMessage);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "validPassword",
  function (this, errorMsg?: string) {
    return this.test(
      "validPassword",
      errorMsg || getMessageAddMethod.validPassword,
      function (input) {
        if (!input) return true;
        const regex = new RegExp(regexValidate.VALID_PASSWORD);

        return regex.test(input);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "validPasswordLength",
  function (this, errorMsg?: string) {
    return this.test(
      "validPasswordLength",
      errorMsg || getMessageAddMethod.validPasswordLength,
      function (input) {
        if (!input) return true;
        const regex = new RegExp(regexValidate.VALID_LENGTH_PASSWORD);

        return regex.test(input);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "validEmail",
  function (this, errorMsg?: string) {
    return this.test(
      "validEmail",
      errorMsg || getMessageAddMethod.validEmail,
      function (input) {
        if (!input) return true;
        const regex = new RegExp(regexValidate.VALID_EMAIL);

        return regex.test(input);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "notEmoji",
  function (this, errorMsg?: string) {
    return this.test(
      "notEmoji",
      errorMsg || getMessageAddMethod.notEmoji,
      function (input) {
        if (!input) return true;
        const regex = new RegExp(regexValidate.EMOJI);

        return !input.match(regex);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "isValidPhoneNumber",
  function (this, errorMsg?: string) {
    return this.test(
      "isValidPhoneNumber",
      errorMsg || getMessageAddMethod.isValidPhoneNumber,
      function (input) {
        if (!input) return true;
        const regex = new RegExp(regexValidate.VALID_PHONE_NUMBER);

        return !!input.match(regex);
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "sameAs",
  function (this: yup.StringSchema, field: string, errorMsg?: string) {
    return this.test(
      "same-as",
      errorMsg || getMessageAddMethod.sameAs,
      function (value) {
        return value === this.parent[field];
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "minDate",
  function (this: yup.StringSchema, field: string, errorMsg?: string) {
    return this.test(
      "min-date",
      errorMsg || getMessageAddMethod.minDate,
      function (value) {
        if (!value) return true;

        return dayjs(value).isSameOrAfter(dayjs(this.parent[field]));
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "requiredSelect",
  function (this: yup.StringSchema, errorMsg?: string) {
    this.notRequired();

    return this.test(
      "requiredSelect",
      errorMsg || getMessageAddMethod.requiredSelect,
      function (value) {
        return value !== undefined && value !== null && value !== "";
      },
    );
  },
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "isValidDate",
  function (this, errorMsg?: string) {
    return this.test(
      "isValidDate",
      errorMsg || getMessageAddMethod.isValidDate,
      function (input) {
        if (!input) return true;
        const dateSplit = input.split("-");

        if (dateSplit.length != 3) return false;
        const year = dateSplit[0];
        const month = dateSplit[1];
        const day = dateSplit[2];

        if (!year && !month && !day) return true;
        if (!year || !month || !day) return false;

        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        );

        return (
          date.getFullYear() === parseInt(year) &&
          date.getMonth() === parseInt(month) - 1 &&
          date.getDate() === parseInt(day)
        );
      },
    );
  },
);

export default yup;
