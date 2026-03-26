import { useState } from 'react';
import type { Category } from '../types';
import { Folder, FolderOpen, Plus, LogOut, Trash2 } from 'lucide-react';
import CategoryModal from './CategoryModal';
import { useI18n } from '../contexts/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onDisconnect: () => void;
}

export default function Sidebar({
  categories,
  selectedCategoryId,
  onSelect,
  onAddCategory,
  onDeleteCategory,
  onDisconnect,
}: SidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useI18n();

  return (
    <div className="w-[280px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full shrink-0 relative z-20">
      <div className="p-5 flex items-center justify-between">
        <h2 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {t.categories}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90, transition: { type: "spring", stiffness: 200, damping: 15 } }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAdding(true)}
          className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/30 p-1.5 rounded-lg transition-colors shadow-sm"
          title={t.newCategory}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4 custom-scrollbar">
        {categories.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400 text-center py-10 font-medium">
            {t.emptySidebar}
          </motion.p>
        ) : (
          categories.map((c) => {
            const isSelected = selectedCategoryId === c.id;
            return (
              <div key={c.id} className="relative group">
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <div
                  onClick={() => onSelect(c.id)}
                  className={`relative flex items-center justify-between px-4 py-3 cursor-pointer z-10 rounded-2xl transition-colors ${
                    isSelected
                      ? 'text-brand-700 dark:text-brand-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 font-semibold hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {isSelected ? (
                      <FolderOpen className="w-4 h-4 text-brand-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 opacity-60 shrink-0 group-hover:opacity-100 group-hover:text-brand-500 transition-all" />
                    )}
                    <span className="text-[14px] truncate tracking-tight">{c.name}</span>
                  </div>
                  
                  {categories.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-all ml-2"
                      title={t.deleteCategory}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDisconnect}
          className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50 transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.disconnect}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <CategoryModal
            onClose={() => setIsAdding(false)}
            onSave={(name) => {
              onAddCategory(name);
              setIsAdding(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
