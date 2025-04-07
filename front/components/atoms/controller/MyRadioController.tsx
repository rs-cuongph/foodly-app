import { forwardRef } from 'react';
import { Control, Controller, Path } from 'react-hook-form';

import MyRadioGroup, { MyRadioGroupProps } from '../RadioGroup';

type MyRadioControllerProps = MyRadioGroupProps & {
  control: Control<any>;
  name: Path<any>;
};
const MyRadioController = forwardRef<HTMLDivElement, MyRadioControllerProps>(
  (props, ref) => {
    return (
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <MyRadioGroup
            {...props}
            ref={ref}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    );
  },
);

MyRadioController.displayName = 'MyRadioController';

export default MyRadioController;
