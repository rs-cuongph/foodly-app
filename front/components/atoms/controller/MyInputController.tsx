import { forwardRef } from 'react';
import { Control, Controller, Path } from 'react-hook-form';

import MyInput, { MyInputProps } from '../Input';
import MyInputNumber, { MyInputNumberProps } from '../InputNumber';
import InputPassword, { InputPasswordProps } from '../InputPassword';

type MyInputControllerProps = MyInputProps &
  InputPasswordProps &
  MyInputNumberProps & {
    control: Control<any>;
    name: Path<any>;
    isPassword?: boolean;
    isNumber?: boolean;
  };

const MyInputController = forwardRef<HTMLInputElement, MyInputControllerProps>(
  (props, ref) => {
    const { isPassword, isNumber } = props;

    return (
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => {
          if (isPassword)
            return (
              <InputPassword
                {...props}
                ref={ref}
                aria-label={props.placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            );

          if (isNumber)
            return (
              <MyInputNumber
                {...props}
                ref={ref}
                aria-label={props.placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            );

          return (
            <MyInput
              {...props}
              ref={ref}
              aria-label={props.placeholder}
              value={field.value}
              onChange={field.onChange}
            />
          );
        }}
      />
    );
  },
);

MyInputController.displayName = 'MyInputController';

export default MyInputController;
