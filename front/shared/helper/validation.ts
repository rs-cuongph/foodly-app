import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export const handleErrFromApi = <T extends FieldValues>(
  error: any,
  setError?: UseFormSetError<T>,
  toastError?: (message: string, title?: string) => void,
  options?: { title?: string },
) => {
  const statusCode = error.status;
  const responseData = error.response?.data;

  if (statusCode === 422) {
    const errors = responseData.message;

    if (errors.length) {
      errors.forEach((error: any) => {
        console.log(error);
        setError?.(error.path as Path<T>, { message: error.messages[0] });
      });
    }
  }

  if (statusCode === 400 || statusCode === 403) {
    setError?.('root.serverError', {
      message: responseData.message,
    });
    toastError?.(responseData.message, options?.title);
  }

  return error.response.data.message;
};
