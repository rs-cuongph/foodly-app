import { Input, InputProps } from '@heroui/react';
import { forwardRef, Ref } from 'react';

export type MyInputProps = InputProps & {
  trim?: boolean;
};

const MyInput = forwardRef(
  (props: MyInputProps, ref: Ref<HTMLInputElement>) => {
    const { trim = true, ...rest } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (trim) {
        e.target.value = e.target.value.trim();
      }
      props.onChange?.(e);
    };

    return (
      <>
        <Input
          maxLength={255}
          size="md"
          {...rest}
          ref={ref}
          isInvalid={!!props.errorMessage}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </>
    );
  },
);

MyInput.displayName = 'MyInput';

export default MyInput;
