import { extendVariants, Button } from '@heroui/react';

export const MyButton = extendVariants(Button, {
  variants: {},
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
  compoundVariants: [
    // <- modify/add compound variants
    // {
    //   isDisabled: true,
    //   color: 'primary',
    //   class: 'bg-[#fe724c]/80 opacity-100',
    // },
  ],
});
