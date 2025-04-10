import { Checkbox, CheckboxGroup, CheckboxGroupProps } from '@heroui/react';
import { forwardRef } from 'react';

export type MyCheckboxGroupProps = CheckboxGroupProps & {
  options: {
    key: string;
    label: string;
  }[];
};

const MyCheckboxGroup = forwardRef<HTMLDivElement, MyCheckboxGroupProps>(
  (props, ref) => {
    return (
      <CheckboxGroup {...props} ref={ref} size="md">
        {props.options.map((option) => (
          <Checkbox
            key={option.key}
            classNames={{
              label: 'text-sm',
            }}
            value={option.key}
          >
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  },
);

MyCheckboxGroup.displayName = 'MyCheckboxGroup';

export default MyCheckboxGroup;
