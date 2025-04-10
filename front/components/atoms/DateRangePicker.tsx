import { DateRangePicker, DateRangePickerProps } from '@heroui/react';
import { parseAbsolute } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { omit } from 'lodash';
import { useParams } from 'next/navigation';
import { forwardRef, Ref } from 'react';

export type MyDateRangePickerProps = DateRangePickerProps & {
  value?: {
    start: string;
    end: string;
  };
  onChange: (value: { start: string; end: string }) => void;
  minValueErrorMessage?: string;
};
const timezone = 'Asia/Ho_Chi_Minh';

const MyDateRangePicker = forwardRef<HTMLInputElement, MyDateRangePickerProps>(
  (props: MyDateRangePickerProps, ref: Ref<HTMLInputElement>) => {
    const { labelPlacement = 'outside', minValueErrorMessage, ...rest } = props;
    const { lang } = useParams();

    // Handle the value properly
    let value = undefined;

    const start = props.value?.start
      ? parseAbsolute(props.value.start, timezone)
      : undefined;
    const end = props.value?.end
      ? parseAbsolute(props.value.end, timezone)
      : undefined;

    if (start && end) {
      value = {
        start: start,
        end: end,
      };
    }

    return (
      <I18nProvider locale={'vi-VN'}>
        <DateRangePicker
          hideTimeZone
          hourCycle={24}
          labelPlacement={labelPlacement}
          pageBehavior="single"
          // showMonthAndYearPickers
          visibleMonths={2}
          {...omit(rest, ['value', 'onChange'])}
          ref={ref}
          errorMessage={props.errorMessage}
          isInvalid={!!props.errorMessage}
          validate={(value) => {
            if (!value) return null;
            const start = value.start.toDate(timezone);
            const end = value.end.toDate(timezone);

            // Basic validation for start <= end
            if (start > end) {
              return 'Start date must be before end date';
            }

            // Custom validation for minValue
            if (props.minValue && value.start < props.minValue) {
              return (
                minValueErrorMessage ||
                'Date cannot be earlier than minimum date'
              );
            }

            return true;
          }}
          value={value}
          onChange={(e) => {
            if (!e) return;
            const start = e.start.toDate(timezone);
            const end = e.end.toDate(timezone);
            const newValue = {
              start: start.toISOString(),
              end: end.toISOString(),
            };

            props.onChange(newValue);
          }}
        />
      </I18nProvider>
    );
  },
);

MyDateRangePicker.displayName = 'MyDateRangePicker';

export default MyDateRangePicker;
