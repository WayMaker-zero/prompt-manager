import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from 'react';
import en from '../locales/en';
import zh from '../locales/zh';

type Language = 'en' | 'zh';
type Translations = typeof en;

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app-lang');
    if (saved === 'en' || saved === 'zh') return saved;
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'));
  };

  const t = lang === 'zh' ? zh : en;

  return (
    <I18nContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
