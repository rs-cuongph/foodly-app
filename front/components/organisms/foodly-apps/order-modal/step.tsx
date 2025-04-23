import { cn } from '@heroui/theme';

type OrderModalStepProps = {
  step: number;
};

export const OrderModalStep = ({ step: currentStep }: OrderModalStepProps) => {
  const getClassNameForText = (step: number) => {
    if (currentStep >= step) {
      return 'text-primary-500';
    }

    return 'text-gray-400';
  };

  const renderDivider = (step: number) => {
    if (currentStep > step) {
      return <div className="absolute inset-0 bg-primary-500" />;
    }

    if (currentStep === step) {
      return (
        <>
          <div className="absolute inset-0 bg-primary-500/30 animate-pulse" />
          <div className="absolute inset-y-0 -left-full w-full bg-primary-500/50 animate-[shimmer_1.5s_infinite]" />
        </>
      );
    }

    return <div className="absolute inset-0 bg-primary-500/30" />;
  };

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-full py-4 px-6 mb-6 flex-row w-full">
      <div className="flex items-center justify-between flex-row">
        <span className={cn('text-medium', getClassNameForText(1))}>
          Chọn Món
        </span>
        <div className="w-[150px] h-1 bg-white rounded-lg relative overflow-hidden">
          {renderDivider(1)}
        </div>
        <span className={cn('text-medium', getClassNameForText(2))}>
          Ghi Chú
        </span>
        <div className="w-[150px] h-1 bg-white rounded-lg relative overflow-hidden">
          {renderDivider(2)}
        </div>
        <span className={cn('text-medium', getClassNameForText(3))}>
          Thanh Toán
        </span>
      </div>
    </div>
  );
};
