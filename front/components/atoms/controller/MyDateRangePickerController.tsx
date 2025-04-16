import { forwardRef } from 'react';
import { Control, Controller, Path } from 'react-hook-form';

import MyDateRangePicker, { MyDateRangePickerProps } from '../DateRangePicker';

export type MyDateRangePickerControllerProps = MyDateRangePickerProps & {
  control: Control<any>;
  name: Path<any>;
  value?: {
    start: string;
    end: string;
  };
};

const MyDateRangePickerController = forwardRef<
  HTMLInputElement,
  MyDateRangePickerControllerProps
>((props, ref) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => {
        return (
          <MyDateRangePicker
            {...props}
            {...field}
            ref={ref}
            aria-label={props.name}
            value={field.value}
            onChange={field.onChange}
          />
        );
      }}
    />
  );
});

MyDateRangePickerController.displayName = 'MyDateRangePickerController';

export default MyDateRangePickerController;
