import { Select, SelectItem, SelectProps } from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface OwnProps<Type extends FieldValues>
  extends Omit<SelectProps, "children"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
  options: { label: string; value: string; icon?: JSX.Element }[];
}
export default function ControlledSelect<T extends FieldValues>({
  formField,
  control,
  options,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      {...props}
      control={control}
      name={formField}
      render={({ field }) => (
        <Select
          {...field}
          {...props}
          className="max-w-xs"
          items={options}
          renderValue={(items) => {
            return items.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                {item.data?.icon}
                <div className="flex flex-col">
                  <span className="text-default-500 text-tiny">
                    {item.data?.label}
                  </span>
                </div>
              </div>
            ));
          }}
        >
          {(option) => (
            <SelectItem key={option.value} textValue={option.value}>
              <div className="flex gap-2 items-center">
                {option?.icon}
                <span className="text-tiny text-default-400">
                  {option.label}
                </span>
              </div>
            </SelectItem>
          )}
        </Select>
      )}
    />
  );
}
