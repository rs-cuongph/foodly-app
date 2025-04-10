'use client';

import { Spinner } from '@heroui/react';

import { FoodLoading } from '@/components/atoms/FoodLoading';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="relative">
          <Spinner className="animate-spin" color="warning" size="lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FoodLoading />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-semibold text-warning-500 animate-pulse">
            Đang tải dữ liệu
          </p>
          <p className="text-sm text-default-500">
            Xin vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    </div>
  );
}
