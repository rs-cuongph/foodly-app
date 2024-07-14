import { Checkbox, CheckboxProps } from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface OwnProps<Type extends FieldValues>
  extends Omit<CheckboxProps, "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
}
export default function ControlledCheckbox<T extends FieldValues>({
  formField,
  control,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <Checkbox
          {...props}
          className={props?.className}
          classNames={props?.classNames}
          maxLength={props?.maxLength}
          placeholder={props?.placeholder}
          size={props?.size}
          type={props?.type || "text"}
          {...field}
          isDisabled={props?.disabled}
          isSelected={field.value}
          onValueChange={(value) => {
            field.onChange(value);
          }}
        />
      )}
    />
  );
}
