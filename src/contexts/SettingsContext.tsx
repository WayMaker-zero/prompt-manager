import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'pm-select-to-copy';
const HTML_CLASS = 'select-to-copy-on';

interface SettingsContextValue {
  selectToCopyEnabled: boolean;
  setSelectToCopyEnabled: (enabled: boolean) => void;
  toggleSelectToCopy: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

function readStoredSelectToCopy(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [selectToCopyEnabled, setSelectToCopyEnabledState] = useState<boolean>(readStoredSelectToCopy);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selectToCopyEnabled ? '1' : '0');
    } catch {
      // ignore quota / private mode
    }

    document.documentElement.classList.toggle(HTML_CLASS, selectToCopyEnabled);
    return () => {
      document.documentElement.classList.remove(HTML_CLASS);
    };
  }, [selectToCopyEnabled]);

  const setSelectToCopyEnabled = useCallback((enabled: boolean) => {
    setSelectToCopyEnabledState(enabled);
  }, []);

  const toggleSelectToCopy = useCallback(() => {
    setSelectToCopyEnabledState((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      selectToCopyEnabled,
      setSelectToCopyEnabled,
      toggleSelectToCopy,
    }),
    [selectToCopyEnabled, setSelectToCopyEnabled, toggleSelectToCopy]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
