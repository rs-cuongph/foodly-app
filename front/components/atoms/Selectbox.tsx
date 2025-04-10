'use client';
import { Select, SelectItem, SelectProps } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';

export type MySelectProps = Omit<SelectProps, 'children'> & {
  options: {
    key: string;
    label: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
  }[];
};

const MySelect = forwardRef<HTMLSelectElement, MySelectProps>((props, ref) => {
  const tCommon = useTranslations('common');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    props.value ? [props.value as string] : [],
  );

  useEffect(() => {
    if (props.value) {
      setSelectedKeys([props.value as string]);
    }
  }, [props.value]);

  return (
    <Select
      labelPlacement="outside"
      placeholder={tCommon('placeholder.select')}
      {...props}
      ref={ref}
      renderValue={(items) => {
        return items.map((item) => {
          return (
            <div key={item.key} className="flex items-center gap-2">
              {item.props?.startContent}
              <span className="text-sm text-primary font-bold">
                {item.textValue}
              </span>
            </div>
          );
        });
      }}
      selectedKeys={selectedKeys}
      size="md"
      onSelectionChange={(keys) => {
        setSelectedKeys(Array.from(keys) as string[]);
        if (props.onChange) {
          const event = {
            target: { value: Array.from(keys)[0] },
          } as React.ChangeEvent<HTMLSelectElement>;

          props.onChange(event);
        }
      }}
    >
      {props.options.map((option) => (
        <SelectItem
          key={option.key}
          endContent={option.endContent}
          startContent={option.startContent}
        >
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
});

MySelect.displayName = 'MySelectbox';

export default MySelect;
