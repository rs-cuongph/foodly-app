import React, { memo } from "react";
import { Spinner as ComponentSpinner, SpinnerProps } from "@nextui-org/react";

const Spinner = memo(
  ({
    label = "Primary",
    labelColor = "primary",
    color = "primary",
    ...rest
  }: SpinnerProps) => {
    return (
      <ComponentSpinner
        color={color}
        label={label}
        labelColor={labelColor}
        {...rest}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
