import { ValidationError } from '@nestjs/common';

type ErrorMessage = {
  path: string[] | string;
  messages: string[];
};

export function formatErrors(errors: ValidationError[]): ErrorMessage[] {
  return errors.flatMap((error) => formatError(error, []));
}

function formatError(
  error: ValidationError,
  parent: string[] | string,
): ErrorMessage[] {
  const path = [...parent, error.property];
  const messages = Object.values(error.constraints ?? {});
  const newPath = path.join('.');

  return [
    ...(messages.length > 0 ? [{ path: newPath, messages }] : []),
    ...error.children.flatMap((child) => formatError(child, path)),
  ];
}
