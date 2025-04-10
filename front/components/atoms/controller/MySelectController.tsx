import { forwardRef } from 'react';
import { Control, Controller, Path } from 'react-hook-form';

import MySelect, { MySelectProps } from '../Selectbox';

type MySelectControllerProps = MySelectProps & {
  control: Control<any>;
  name: Path<any>;
};

const MySelectController = forwardRef<
  HTMLSelectElement,
  MySelectControllerProps
>((props, ref) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <MySelect
          {...props}
          ref={ref}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
});

MySelectController.displayName = 'MySelectController';

export default MySelectController;
