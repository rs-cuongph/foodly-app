import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownMenuProps,
  DropdownProps,
  DropdownTrigger,
  DropdownTriggerProps,
  SharedSelection,
} from '@heroui/react';
import { omit } from 'lodash';
import { forwardRef, useRef, useState } from 'react';

import MyButton, { MyButtonProps } from './Button';

import { useClickOutside } from '@/hooks/click-outside';

type MyDropdownProps = {
  dropdownProps?: DropdownProps;
  dropdownTriggerProps?: DropdownTriggerProps;
  dropdownMenuProps?: Omit<
    DropdownMenuProps,
    'children' | 'onSelectionChange'
  > & {
    onSelectionChange?: (keys: string[]) => void;
  };
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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set(dropdownMenuProps?.selectedKeys ?? []),
  );

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleOnSelectionChange = (keys: SharedSelection) => {
    setSelectedKeys(keys);
    dropdownMenuProps?.onSelectionChange?.(
      Array.from(keys).map((key) => key.toString()),
    );
    setIsOpen(false);
  };

  return (
    <Dropdown ref={ref} {...dropdownProps} isOpen={isOpen}>
      <DropdownTrigger {...dropdownTriggerProps}>
        <MyButton
          size="lg"
          variant="flat"
          {...omit(myButtonProps, ['ref'])}
          onPress={() => setIsOpen(!isOpen)}
        >
          {props.triggerContent}
        </MyButton>
      </DropdownTrigger>
      <DropdownMenu
        ref={dropdownRef}
        disallowEmptySelection
        aria-label="Table Columns"
        closeOnSelect={false}
        selectionMode="multiple"
        {...dropdownMenuProps}
        selectedKeys={selectedKeys}
        onSelectionChange={handleOnSelectionChange}
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
