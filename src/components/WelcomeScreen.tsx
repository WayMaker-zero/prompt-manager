import { Database, FolderOpen, Plus, Sparkles } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  fileHandle: any;
  onRestore: () => void;
  onOpen: () => void;
  onCreate: () => void;
  onDisconnect: () => void;
}

export default function WelcomeScreen({
  fileHandle,
  onRestore,
  onOpen,
  onCreate,
  onDisconnect
}: WelcomeScreenProps) {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Animated Blobs Background */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/40 blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900/40 blob animation-delay-4000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/40 blob pointer-events-none"></div>

      {/* Top Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 flex gap-3 z-20"
      >
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
        >
          <Languages className="w-4 h-4" />
          <span>{lang === 'zh' ? 'EN' : '中文'}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 glass-panel rounded-3xl p-10 max-w-[460px] w-full mx-4"
      >
        <div className="text-center space-y-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-gradient-to-br from-brand-400 to-indigo-600 dark:from-brand-600 dark:to-indigo-800 p-5 rounded-[2rem] w-24 h-24 mx-auto flex items-center justify-center shadow-2xl shadow-brand-500/30 dark:shadow-brand-900/50"
          >
            <Database className="w-12 h-12 text-white" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              {t.appName}
              <Sparkles className="w-6 h-6 text-brand-500" />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {fileHandle ? (
            <div className="space-y-4 p-6 rounded-3xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-inner">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                {t.foundPrevious} <br />
                <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-lg text-xs font-bold border border-brand-200 dark:border-brand-800/50">
                  <FolderOpen className="w-3.5 h-3.5" />
                  {fileHandle.name}
                </span>
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRestore}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-500 dark:to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-brand-500/20 font-bold tracking-wide border border-transparent"
              >
                <span>{t.restoreConnection}</span>
              </motion.button>

              <button
                onClick={onDisconnect}
                className="w-full text-sm font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors pt-2"
              >
                {t.forgetFile}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpen}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-500 dark:to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-brand-500/20 font-bold tracking-wide"
              >
                <FolderOpen className="w-5 h-5 opacity-80" />
                <span>{t.openExisting}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreate}
                className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 border-2 border-slate-200/60 dark:border-slate-700/60 px-6 py-4 rounded-2xl font-bold tracking-wide hover:border-brand-300 dark:hover:border-brand-600 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 opacity-80" />
                <span>{t.createNew}</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
