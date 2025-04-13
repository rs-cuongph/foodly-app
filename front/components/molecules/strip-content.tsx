import { SlotsToClasses, Tooltip } from '@heroui/react';

export type StripContentProps = {
  content: string;
  classNames?: SlotsToClasses<'content' | 'base' | 'arrow'>;
  maxContentLength?: number;
};

export const StripContent = ({
  content,
  maxContentLength = 100,
  classNames,
}: StripContentProps) => {
  const contentLength = content.length;

  if (contentLength <= maxContentLength)
    return <span className={classNames?.content as string}>{content}</span>;

  const contentSlice = content.slice(0, maxContentLength) + '...';

  return (
    <Tooltip classNames={classNames} content={content}>
      {contentSlice}
    </Tooltip>
  );
};
