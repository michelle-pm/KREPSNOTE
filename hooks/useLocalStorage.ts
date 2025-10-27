import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Workspace } from '../types';

const DEFAULT_WORKSPACE_ID = 'default-workspace';

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
      if (item) {
        return JSON.parse(item);
      }
      if (key === 'workspaces' && userEmail) {
        const newWorkspace: Workspace = {
          id: DEFAULT_WORKSPACE_ID,
          name: 'Мое пространство',
          widgets: [],
          layouts: {},
        };
        return [newWorkspace] as unknown as T;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${prefixedKey}”:`, error);
      return initialValue;
    }
  });
  
  // This effect handles user login/logout, which changes the prefixedKey.
  // It re-initializes the state based on the new key.
  useEffect(() => {
    let value: T;
    if (typeof window === 'undefined') {
      value = initialValue;
    } else {
      try {
        const item = window.localStorage.getItem(prefixedKey);
        if (item) {
          value = JSON.parse(item);
        } else if (key === 'workspaces' && userEmail) {
          const newWorkspace: Workspace = { id: DEFAULT_WORKSPACE_ID, name: 'Мое пространство', widgets: [], layouts: {}, };
          value = [newWorkspace] as unknown as T;
        } else {
          value = initialValue;
        }
      } catch (error) {
        console.error(`Error reading localStorage key “${prefixedKey}”:`, error);
        value = initialValue;
      }
    }
    setStoredValue(value);
  // The dependency array correctly triggers this effect only when the user context changes.
  // We disable the lint rule because `initialValue` is only a fallback and should not trigger this effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefixedKey]);


  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && storedValue !== undefined) {
        window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${prefixedKey}”:`, error);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
