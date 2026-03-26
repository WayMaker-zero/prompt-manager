import { useState } from 'react';
import type { Category, Prompt } from '../types';
import PromptCard from './PromptCard';
import PromptModal from './PromptModal';
import { Plus, Inbox, Languages, Moon, Sun } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MainAreaProps {
  category?: Category;
  onUpdateCategory: (category: Category) => void;
}

export default function MainArea({ category, onUpdateCategory }: MainAreaProps) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  // Top Right Actions Component
  const TopActions = () => (
    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLang}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all"
      >
        <Languages className="w-4 h-4" />
        <span>{lang === 'zh' ? 'EN' : '中文'}</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.button>
    </div>
  );

  if (!category) {
    return (
      <div className="flex-1 flex flex-col relative bg-[var(--bg-base)]">
        <div className="absolute top-6 right-8 z-20">
          <TopActions />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="bg-slate-200/50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] mb-6 shadow-inner"
          >
            <Inbox className="w-16 h-16 text-slate-400 dark:text-slate-500 stroke-[1.5]" />
          </motion.div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-bold tracking-tight">{t.selectOrCreate}</p>
        </div>
      </div>
    );
  }

  const handleSavePrompt = (promptData: Omit<Prompt, 'id'>) => {
    if (editingPrompt) {
      const updatedPrompts = category.prompts.map((p) =>
        p.id === editingPrompt.id ? { ...p, ...promptData } : p
      );
      onUpdateCategory({ ...category, prompts: updatedPrompts });
    } else {
      const newPrompt: Prompt = { id: uuidv4(), ...promptData };
      onUpdateCategory({
        ...category,
        prompts: [newPrompt, ...category.prompts],
      });
    }
    setEditingPrompt(null);
    setIsCreating(false);
  };

  const handleDeletePrompt = (id: string) => {
    onUpdateCategory({
      ...category,
      prompts: category.prompts.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-base)] overflow-hidden relative">
      <div className="flex-shrink-0 px-10 py-8 flex justify-between items-end bg-gradient-to-b from-[var(--bg-base)] via-[var(--bg-base)] to-transparent z-10 sticky top-0 pb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          key={category.id}
          className="space-y-1.5"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            {category.name}
            <span className="bg-slate-200/60 dark:bg-slate-800/60 px-2.5 py-1 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700/40 shadow-sm align-middle">
              {category.prompts.length}
            </span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-6">
          <TopActions />
          
          <div className="w-px h-8 bg-slate-300/50 dark:bg-slate-700/50 hidden sm:block"></div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-white/10 font-bold tracking-wide transition-all"
          >
            <Plus className="w-5 h-5 opacity-80" strokeWidth={2.5} />
            <span>{t.addPrompt}</span>
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-12 pt-2 custom-scrollbar">
        {category.prompts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-[3rem] bg-white/30 dark:bg-slate-900/30"
          >
            <div className="bg-slate-200/50 dark:bg-slate-800/50 p-6 rounded-full mb-6">
              <Inbox className="w-10 h-10 text-slate-400 dark:text-slate-500 stroke-2" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-xl font-bold tracking-tight">{t.noPrompts}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="text-brand-600 dark:text-brand-400 font-extrabold flex items-center gap-2 hover:text-brand-700 dark:hover:text-brand-300 transition-colors bg-brand-50 dark:bg-brand-900/30 px-6 py-3 rounded-2xl"
            >
              {t.createFirst} <Plus className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 auto-rows-max">
            <AnimatePresence mode="popLayout">
              {category.prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={() => setEditingPrompt(prompt)}
                  onDelete={() => handleDeletePrompt(prompt.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {(isCreating || editingPrompt) && (
          <PromptModal
            prompt={editingPrompt || undefined}
            onClose={() => {
              setIsCreating(false);
              setEditingPrompt(null);
            }}
            onSave={handleSavePrompt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
