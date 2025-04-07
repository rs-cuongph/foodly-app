import { DateRangePicker, DateRangePickerProps } from '@heroui/react';
import { forwardRef, Ref } from 'react';

export type MyDateRangePickerProps = DateRangePickerProps & {};

const MyDateRangePicker = forwardRef(
  (props: MyDateRangePickerProps, ref: Ref<HTMLInputElement>) => {
    const { labelPlacement = 'outside', ...rest } = props;

    return (
      <DateRangePicker
        labelPlacement={labelPlacement}
        pageBehavior="single"
        visibleMonths={2}
        {...rest}
        ref={ref}
        isInvalid={!!props.errorMessage}
      />
    );
  },
);

MyDateRangePicker.displayName = 'MyDateRangePicker';

export default MyDateRangePicker;
