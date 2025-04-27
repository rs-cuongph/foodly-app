import { DateRangePicker, DateRangePickerProps } from '@heroui/react';
import { parseAbsolute } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { omit } from 'lodash';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { forwardRef, Ref } from 'react';

import { useWindowSize } from '@/hooks/window-size';

export type MyDateRangePickerProps = Omit<
  DateRangePickerProps,
  'value' | 'onChange' | 'minValue'
> & {
  value?: {
    start: string;
    end: string;
  };
  onChange?: (value: { start: string; end: string }) => void;
  minValueErrorMessage?: string;
  minValue?: string | null;
};
const timezone = 'Asia/Ho_Chi_Minh';

const MyDateRangePicker = forwardRef<HTMLInputElement, MyDateRangePickerProps>(
  (props: MyDateRangePickerProps, ref: Ref<HTMLInputElement>) => {
    const { labelPlacement = 'outside', minValueErrorMessage, ...rest } = props;
    const { lang } = useParams();
    const t = useTranslations();
    const { isMobile } = useWindowSize();

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

    const minValue = props.minValue
      ? parseAbsolute(props.minValue, timezone)
      : undefined;

    return (
      <I18nProvider locale={lang as string}>
        <DateRangePicker
          hideTimeZone
          hourCycle={24}
          labelPlacement={labelPlacement}
          pageBehavior="single"
          // showMonthAndYearPickers={isMobile}
          visibleMonths={isMobile ? 1 : 2}
          {...omit(rest, ['value', 'onChange'])}
          ref={ref}
          errorMessage={props.errorMessage}
          isInvalid={!!props.errorMessage}
          minValue={minValue}
          value={value}
          onChange={(e) => {
            if (!e) return;
            const start = e.start.toDate(timezone);
            const end = e.end.toDate(timezone);
            const newValue = {
              start: start.toISOString(),
              end: end.toISOString(),
            };

            props.onChange?.(newValue);
          }}
        />
      </I18nProvider>
    );
  },
);

MyDateRangePicker.displayName = 'MyDateRangePicker';

export default MyDateRangePicker;
