import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export const handleErrFromApi = <T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
  toastError?: (message: string, title?: string) => void,
) => {
  const statusCode = error.status;
  const responseData = error.response?.data;

  if (statusCode === 422) {
    const errors = responseData.message;

    if (errors.length) {
      errors.forEach((error: any) => {
        setError(error.path as Path<T>, { message: error.messages[0] });
      });
    }
  }

  if (statusCode === 400) {
    setError('root.serverError', {
      message: responseData.message,
    });
    toastError?.(responseData.message);
  }

  return error.response.data.message;
};
