import { forwardRef } from 'react';
import { Control, Controller, Path } from 'react-hook-form';

import MyTextarea, { MyTextareaProps } from '../Textarea';

type MyTextareaControllerProps = MyTextareaProps & {
  control: Control<any>;
  name: Path<any>;
};

const MyTextareaController = forwardRef<
  HTMLTextAreaElement,
  MyTextareaControllerProps
>((props, ref) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => {
        return (
          <MyTextarea
            {...props}
            ref={ref}
            aria-label={props.placeholder}
            value={field.value}
            onChange={field.onChange}
          />
        );
      }}
    />
  );
});

MyTextareaController.displayName = 'MyTextareaController';

export default MyTextareaController;
