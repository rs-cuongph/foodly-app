import { NumberInput, NumberInputProps } from '@heroui/react';
import { omit } from 'lodash';
import { forwardRef } from 'react';

export type MyInputNumberProps = NumberInputProps & {};

const MyInputNumber = forwardRef<HTMLInputElement, MyInputNumberProps>(
  (props, ref) => {
    return (
      <NumberInput
        errorMessage={props.errorMessage}
        isInvalid={!!props.errorMessage}
        labelPlacement="outside"
        size="md"
        {...omit(props, ['onChange', 'onChangeValue'])}
        ref={ref}
        onChange={(e: any) => {
          const isNum = typeof e === 'number';

          if (isNum) {
            props.onChange?.(e);
          }
        }}
      />
    );
  },
);

MyInputNumber.displayName = 'MyInputNumber';

export default MyInputNumber;
