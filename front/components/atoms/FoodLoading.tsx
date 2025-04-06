'use client';

import { Spinner } from '@heroui/react';

import { CoffeeIcon } from './icons';

interface FoodLoadingProps {
  icon?: React.ReactNode;
}

export const FoodLoading = ({
  icon = <CoffeeIcon className="h-6 w-6 text-primary animate-bounce" />,
}: FoodLoadingProps) => {
  return (
    <div className="relative">
      <Spinner className="animate-spin" color="primary" size="lg" />
      <div className="absolute inset-0 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};
