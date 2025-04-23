import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  SlotsToClasses,
} from '@heroui/react';
import { forwardRef } from 'react';

export type MyCheckboxGroupProps = CheckboxGroupProps & {
  options: {
    key: string;
    label: string;
  }[];
  gridColumn?: 1 | 2 | 3;
  checkBoxClassNames?:
    | SlotsToClasses<'base' | 'label' | 'icon' | 'wrapper' | 'hiddenInput'>
    | undefined;
};

const MyCheckboxGroup = forwardRef<HTMLDivElement, MyCheckboxGroupProps>(
  (props, ref) => {
    const { gridColumn = 1, checkBoxClassNames, ...rest } = props;

    const gridClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
    }[gridColumn];

    return (
      <CheckboxGroup
        {...rest}
        ref={ref}
        className={`grid gap-4 ${gridClass}`}
        size="md"
      >
        {props.options.map((option) => (
          <Checkbox
            key={option.key}
            classNames={{
              label: 'text-sm',
              ...checkBoxClassNames,
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
