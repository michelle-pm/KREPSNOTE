import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  userEmail?: string | null
): [T, Dispatch<SetStateAction<T>>] {
  
  const prefixedKey = userEmail ? `${userEmail}_${key}` : key;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // This effect will re-initialize the state if the user logs in/out.
  useEffect(() => {
    try {
        const item = window.localStorage.getItem(prefixedKey);
        setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
        console.error(error);
        setStoredValue(initialValue);
    }
  }, [prefixedKey]);


  useEffect(() => {
    try {
      const valueToStore =
        typeof storedValue === 'function'
          ? storedValue(storedValue)
          : storedValue;
      window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
