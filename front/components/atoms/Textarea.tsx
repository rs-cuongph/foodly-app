import { Textarea, TextAreaProps } from '@heroui/react';
import { forwardRef } from 'react';

export type MyTextareaProps = TextAreaProps & {};

const MyTextarea = forwardRef<HTMLTextAreaElement, MyTextareaProps>(
  (props, ref) => {
    return <Textarea {...props} ref={ref} />;
  },
);

MyTextarea.displayName = 'MyTextarea';

export default MyTextarea;
