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

export type ListboxItem = Omit<ListboxItemProps, 'onPress'> & {
  text: string;
  isShow: (() => boolean) | boolean;
  onPress: (setPopoverState: (state: boolean) => void) => void;
};

export type GroupActionBtnProps = {
  items: ListboxItem[];
  backdrop?: 'blur' | 'transparent' | 'opaque';
};

export default function GroupActionBtn(props: GroupActionBtnProps) {
  const [popoverState, setPopoverState] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const items = props.items.filter((item) => {
    if (typeof item.isShow === 'function') {
      return item.isShow();
    }

    return item.isShow;
  });

  useClickOutside(listBoxRef, () => {
    setPopoverState(false);
  });

  return (
    <Popover
      ref={popoverRef}
      shouldBlockScroll
      backdrop={props.backdrop ?? 'blur'}
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
            const { key, startContent, text, onPress, ...rest } = item;

            return (
              <ListboxItem
                key={key}
                startContent={startContent}
                {...rest}
                onPress={() => onPress(setPopoverState)}
              >
                {text}
              </ListboxItem>
            );
          })}
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
