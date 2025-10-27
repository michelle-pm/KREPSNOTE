import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Workspace } from '../types';

const DEFAULT_WORKSPACE_ID = 'default-workspace';

/**
 * Reads a value from localStorage for a given user.
 * This function is the single source of truth for initializing state from storage.
 * It is designed to be non-destructive.
 */
function getInitialValue<T>(key: string, initialValue: T, userEmail?: string | null): T {
  const prefixedKey = userEmail ? `${userEmail}_${key}` : key;

  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(prefixedKey);
    // If data exists for the user, parse and return it.
    if (item) {
      return JSON.parse(item);
    }

    // --- Logic for creating default data for a NEW user ---
    // This only runs if `item` is null.
    if (userEmail) {
      if (key === 'workspaces') {
        const newWorkspace: Workspace = {
          id: DEFAULT_WORKSPACE_ID,
          name: 'Мое пространство',
          widgets: [],
          layouts: {},
        };
        // Return the default workspace structure for a new user.
        return [newWorkspace] as unknown as T;
      }
      if (key === 'activeWorkspaceId') {
        return DEFAULT_WORKSPACE_ID as unknown as T;
      }
    }

    // Fallback for logged-out users or non-user-specific keys.
    return initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${prefixedKey}”:`, error);
    return initialValue;
  }
}

/**
 * A hook to manage state in localStorage, safely handling user authentication changes.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
  userEmail?: string | null
): [T, Dispatch<SetStateAction<T>>] {
  
  const prefixedKey = userEmail ? `${userEmail}_${key}` : key;

  // Initialize state using our safe getter function.
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getInitialValue(key, initialValue, userEmail);
  });
  
  // This effect re-initializes the state when the user logs in or out (prefixedKey changes).
  useEffect(() => {
    setStoredValue(getInitialValue(key, initialValue, userEmail));
  // This effect MUST run only when the user context changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefixedKey]);


  // This effect persists any change in state back to localStorage.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${prefixedKey}”:`, error);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
