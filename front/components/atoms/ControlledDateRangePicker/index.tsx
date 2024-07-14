import { DateRangePickerProps, DateRangePicker } from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";
import { I18nProvider } from "@react-aria/i18n";

interface OwnProps<Type extends FieldValues>
  extends Omit<DateRangePickerProps, "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
}
export default function ControlledDateRangePicker<T extends FieldValues>({
  formField,
  control,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <I18nProvider locale="en-GB">
          <DateRangePicker
            {...props}
            {...field}
            errorMessage={props?.errorMessage}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
            }}
          />
        </I18nProvider>
      )}
    />
  );
}
