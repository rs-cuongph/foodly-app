import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import {
  Listbox,
  ListboxItem,
  ListboxItemProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { useRef, useState } from 'react';

import MyButton from '@/components/atoms/Button';
import { useClickOutside } from '@/hooks/click-outside';

export type ListboxItem = ListboxItemProps & {
  text: string;
  isShow: boolean | (() => boolean);
};

export type GroupActionBtnProps = {
  items: ListboxItem[];
};

export default function GroupActionBtn(props: GroupActionBtnProps) {
  const [popoverState, setPopoverState] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const { items } = props;

  useClickOutside(listBoxRef, () => {
    setPopoverState(false);
  });

  return (
    <Popover
      ref={popoverRef}
      shouldBlockScroll
      backdrop={'blur'}
      isOpen={popoverState}
      offset={10}
      placement="left-start"
      onOpenChange={setPopoverState}
    >
      <PopoverTrigger>
        <MyButton
          isIconOnly
          variant="light"
          onPress={() => setPopoverState(true)}
        >
          <AdjustmentsHorizontalIcon className="h-6 w-6 text-primary" />
        </MyButton>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox
          ref={listBoxRef}
          aria-label="Listbox menu with icons"
          variant="flat"
        >
          {items.map((item) => {
            const { key, startContent, text, ...rest } = item;

            return (
              <ListboxItem key={key} startContent={startContent} {...rest}>
                {text}
              </ListboxItem>
            );
          })}
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
