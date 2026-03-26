import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { Languages, Moon, Sun, Database } from 'lucide-react';

export default function Header({ fileName }: { fileName?: string }) {
  const { t, toggleLang, lang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 dark:bg-indigo-500 p-1.5 rounded-lg flex items-center justify-center shadow-sm">
          <Database className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
          {t.appName}
        </h1>
        {fileName && (
          <div className="ml-4 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 hidden sm:flex items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={fileName}>
              📄 {fileName}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={t.langToggle}
        >
          <Languages className="w-4 h-4" />
          <span>{lang === 'zh' ? 'EN' : '中'}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'light' ? t.themeDark : t.themeLight}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
