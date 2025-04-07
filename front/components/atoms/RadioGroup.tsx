import { Radio, RadioGroup, RadioGroupProps } from '@heroui/react';
import { forwardRef, Ref } from 'react';

export type MyRadioGroupProps = RadioGroupProps & {
  options: {
    key: string;
    label: string;
  }[];
};

const MyRadioGroup = forwardRef(
  (props: MyRadioGroupProps, ref: Ref<HTMLDivElement>) => {
    return (
      <RadioGroup
        classNames={{
          label: 'text-sm font-medium text-foreground',
        }}
        {...props}
        ref={ref}
      >
        {props.options.map((option) => (
          <Radio
            key={option.key}
            classNames={{
              label: 'text-sm',
            }}
            value={option.key}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    );
  },
);

MyRadioGroup.displayName = 'MyRadioGroup';

export default MyRadioGroup;
