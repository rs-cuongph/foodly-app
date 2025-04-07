// eslint-disable-next-line
import 'yup';
declare module 'yup' {
  interface StringSchema {
    noEmoji(message?: string): this;
    password(message?: string): this;
    requireSelect: (message?: string) => this;
    isPhone(message?: string): this;
    isNumber(message?: string): this;
    sameAs(field: string, errorMsg?: string): this;
    // noSpecialCharacters(message?: string): this;
  }
}
