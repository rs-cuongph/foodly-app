import { Skeleton, SkeletonProps } from '@heroui/react';

type SkeletonWrapperProps = SkeletonProps & {
  children?: React.ReactNode;
};

export default function SkeletonWrapper({
  children,
  classNames,
  ...props
}: SkeletonWrapperProps) {
  return (
    <Skeleton classNames={classNames} {...props}>
      {children}
    </Skeleton>
  );
}
