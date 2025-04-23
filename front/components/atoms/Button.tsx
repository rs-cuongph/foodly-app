import { Button, ButtonProps } from '@heroui/react';
import clsx from 'clsx';
import { omit } from 'lodash';
import { forwardRef } from 'react';

import { useDevice } from '@/hooks/device';

export type MyButtonProps = ButtonProps & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const MyButton = forwardRef<HTMLButtonElement, MyButtonProps>(
  (props, ref) => {
    const { detectDevice } = useDevice();
    const isMobile = detectDevice().deviceType === 'mobile';
    const event = isMobile
      ? { onClick: props.onPress as any, onPress: undefined }
      : { onPress: props.onPress, onClick: undefined };

    return (
      <Button
        color="primary"
        size="md"
        {...omit(props, ['onClick', 'onPress'])}
        ref={ref}
        className={clsx(props.className, {
          'opacity-50': props.disabled,
          'cursor-not-allowed': props.disabled,
        })}
        {...event}
      />
    );
  },
);

MyButton.displayName = 'MyButton';

export default MyButton;
