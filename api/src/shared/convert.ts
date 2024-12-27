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

export function convertToUUID(rawString: string) {
  const cleanString = rawString.replace(/-/g, '');

  if (cleanString.length !== 32) {
    throw new Error('String is not a valid UUID');
  }

  const formattedUUID = `${cleanString.slice(0, 8)}-${cleanString.slice(8, 12)}-${cleanString.slice(12, 16)}-${cleanString.slice(16, 20)}-${cleanString.slice(20)}`;

  return formattedUUID;
}
