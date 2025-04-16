import { forwardRef } from 'react';
import { Control, Controller, Path } from 'react-hook-form';

import MyCheckboxGroup, { MyCheckboxGroupProps } from '../CheckboxGroup';

type MyCheckBoxControllerProps = MyCheckboxGroupProps & {
  control: Control<any>;
  name: Path<any>;
};
const MyCheckBoxController = forwardRef<
  HTMLDivElement,
  MyCheckBoxControllerProps
>((props, ref) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <MyCheckboxGroup
          {...props}
          ref={ref}
          value={field.value}
          onChange={(value) => {
            field.onChange(value);
            props.onChange?.(value);
          }}
        />
      )}
    />
  );
});

MyCheckBoxController.displayName = 'MyCheckBoxController';

export default MyCheckBoxController;
