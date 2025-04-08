import { DateRangePicker, DateRangePickerProps } from '@heroui/react';
import { parseAbsolute } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useParams } from 'next/navigation';
import { forwardRef, Ref } from 'react';

export type MyDateRangePickerProps = DateRangePickerProps & {
  value?: {
    start: string;
    end: string;
  };
};

const MyDateRangePicker = forwardRef<HTMLInputElement, MyDateRangePickerProps>(
  (props: MyDateRangePickerProps, ref: Ref<HTMLInputElement>) => {
    const { labelPlacement = 'outside', ...rest } = props;
    const { lang } = useParams();

    // Handle the value properly
    let value = undefined;
    const start = props.value?.start
      ? parseAbsolute(props.value?.start ?? '', 'Asia/Ho_Chi_Minh')
      : undefined;
    const end = props.value?.end
      ? parseAbsolute(props.value?.end ?? '', 'Asia/Ho_Chi_Minh')
      : undefined;

    if (start && end) {
      value = {
        start: start,
        end: end,
      };
    }

    return (
      <I18nProvider locale={lang as string}>
        <DateRangePicker
          labelPlacement={labelPlacement}
          pageBehavior="single"
          visibleMonths={2}
          {...rest}
          ref={ref}
          errorMessage={props.errorMessage}
          isInvalid={!!props.errorMessage}
          value={value}
        />
      </I18nProvider>
    );
  },
);

MyDateRangePicker.displayName = 'MyDateRangePicker';

export default MyDateRangePicker;
