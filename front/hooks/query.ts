import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUpdateEffect } from './update-effect';

export function useStateQueryParams<T>(initialState: T) {
  const searchParams = useSearchParams();

  const [value, setValue] = useState<T>(initialState);

  useUpdateEffect(() => {}, [value]);

  useEffect(() => {}, []);

  const setSpecificValue = (key: keyof T, value: T[keyof T]) => {
    setValue((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return [value, setValue, setSpecificValue] as [
    typeof value,
    typeof setValue,
    typeof setSpecificValue,
  ];
}
