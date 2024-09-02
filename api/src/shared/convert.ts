import { mapKeys, snakeCase } from 'lodash';

export const convertVNDStringToNumber = (text?: string | null) => {
  if (!text) return 0;
  // Remove non-numeric characters (except for commas and periods)
  const cleanedText = text.replace(/[^0-9,.]/g, '');

  // Replace commas with periods (to handle European number formats if needed)
  const standardizedText = cleanedText.replace(/,/g, '');

  // Parse the cleaned text as an integer, ignoring any decimal portion
  const amount = parseInt(standardizedText, 10);

  return amount;
};

export const upsertResponse = (id: number, isSuccess = true) => {
  return {
    success: isSuccess,
    id,
  };
};

export const transformDataByTemplate = (payload, template) => {
  Object.keys(payload).map((key) => {
    if (!Object.keys(template).includes(key)) {
      delete payload[key];
    }
  });
  return payload;
};

export function camelToSnake(obj) {
  return mapKeys(obj, (value, key) => snakeCase(key));
}
