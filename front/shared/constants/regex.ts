export const regexErrorPage = new RegExp(/^(\/404|\/403|\/500)/);
export const regexValidate = {
  VALID_HIRAGANA: /^[\u3040-\u309F]+$/,
  VALID_PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
  VALID_LENGTH_PASSWORD: /^.{8,24}$/,
  VALID_PHONE_NUMBER: /^0[0-9]{9,10}$/,
  VALID_EMAIL:
    /^[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/,
  EMOJI:
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g,
};
export const regexDate = {
  FORMAT_DATE: /\//g,
  FORMAT_DATE_YEAR: /-/g,
  FORMAT_YEAR_MONTH: /(\d+)\/(\d+)\/(\d+)/,
};
