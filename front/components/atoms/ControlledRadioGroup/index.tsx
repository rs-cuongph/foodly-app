import {
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioProps,
} from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface OwnProps<Type extends FieldValues>
  extends Omit<RadioGroupProps, "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
  options: (RadioProps & { label: string })[];
}
export default function ControlledRadioGroup<T extends FieldValues>({
  formField,
  control,
  options,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <RadioGroup
          {...props}
          className={props?.className}
          size={props?.size}
          {...field}
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);
          }}
        >
          {options.map((option, index) => {
            return (
              <Radio
                key={index}
                {...option}
                description={option.description}
                value={option.value}
              >
                {option.label}
              </Radio>
            );
          })}
        </RadioGroup>
      )}
    />
  );
}
