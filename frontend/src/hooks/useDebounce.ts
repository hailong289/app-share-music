// src/hooks/useDebounce.ts
import { debounce, type DebouncedFunc } from "lodash";
import { useMemo } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): DebouncedFunc<T> {
  return useMemo(() => debounce(fn, delay), [fn, delay]);
}
