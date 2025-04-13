import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownMenuProps,
  DropdownProps,
  DropdownTrigger,
  DropdownTriggerProps,
} from '@heroui/react';
import { omit } from 'lodash';
import { forwardRef } from 'react';

import MyButton, { MyButtonProps } from './Button';

type MyDropdownProps = {
  dropdownProps?: DropdownProps;
  dropdownTriggerProps?: DropdownTriggerProps;
  dropdownMenuProps?: DropdownMenuProps;
  myButtonProps?: MyButtonProps;
  columns: { uid: string; name: string }[];
  triggerContent: React.ReactNode;
};

const MyDropdown = forwardRef<HTMLDivElement, MyDropdownProps>((props, ref) => {
  const {
    columns,
    dropdownProps,
    dropdownTriggerProps,
    dropdownMenuProps,
    myButtonProps,
  } = props;

  return (
    <Dropdown ref={ref} {...dropdownProps}>
      <DropdownTrigger {...dropdownTriggerProps}>
        <MyButton size="lg" variant="flat" {...omit(myButtonProps, ['ref'])}>
          {props.triggerContent}
        </MyButton>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Table Columns"
        closeOnSelect={false}
        selectedKeys={[]}
        selectionMode="multiple"
        {...dropdownMenuProps}
      >
        {columns.map((column) => (
          <DropdownItem key={column.uid} className="capitalize">
            {column.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});

MyDropdown.displayName = 'MyDropdown';

export default MyDropdown;
