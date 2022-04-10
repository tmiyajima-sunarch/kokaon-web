import { useState, useCallback } from 'react';
import { loadLocalStorage, saveLocalStorage } from './functions';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const get = useCallback(<T>(value: T | (() => T)) => {
    return value instanceof Function ? value() : value;
  }, []);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (window === undefined) {
      return get(initialValue);
    }

    try {
      const value = loadLocalStorage(key);
      return value === null ? get(initialValue) : (value as T);
    } catch (error) {
      console.error(error);
      return get(initialValue);
    }
  });

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (window !== undefined) {
          saveLocalStorage(key, valueToStore);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}
