import { useState, useEffect } from 'react';

// value가 변경되어도 바로 업데이트되지 않고, delay만큼 시간이 지난 뒤에 업데이트되는 훅
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}