import { Input, SlotsToClasses } from "@nextui-org/react";
import { ReactNode, FocusEvent } from "react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface InputProps {
  type: string;
  label?: string;
  errorMessage?: string;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "none" | "full";
  classNames?:
    | SlotsToClasses<
        | "description"
        | "base"
        | "input"
        | "label"
        | "errorMessage"
        | "mainWrapper"
        | "inputWrapper"
        | "innerWrapper"
        | "clearButton"
        | "helperWrapper"
      >
    | undefined;
  onChange?: (value: string) => void;
  disabled?: boolean;
  endContent?: ReactNode;
  onBlur?: (e: FocusEvent<Element>) => void;
}
interface OwnProps<Type extends FieldValues> extends Omit<InputProps, "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
}
export default function ControlledInput<T extends FieldValues>({
  formField,
  control,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <Input
          className={props?.className}
          classNames={props?.classNames}
          endContent={props.endContent}
          errorMessage={props?.errorMessage}
          isInvalid={!!props?.errorMessage?.length}
          label={props?.label}
          labelPlacement={props?.labelPlacement || "inside"}
          maxLength={props?.maxLength}
          placeholder={props?.placeholder}
          size={props?.size}
          type={props?.type || "text"}
          {...field}
          isDisabled={props?.disabled}
          radius={props?.radius}
          onBlur={props.onBlur}
          onValueChange={(value) => {
            field.onChange(value);
            props?.onChange?.(value);
          }}
        />
      )}
    />
  );
}
