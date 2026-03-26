import { useState, useRef, useEffect } from 'react';
import type { Prompt } from '../types';
import { X, Type, Wand2 } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { motion } from 'framer-motion';

interface PromptModalProps {
  prompt?: Prompt;
  onClose: () => void;
  onSave: (promptData: Omit<Prompt, 'id'>) => void;
}

export default function PromptModal({ prompt, onClose, onSave }: PromptModalProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [content, setContent] = useState(prompt?.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!prompt) setTitle('');
  }, [prompt]);

  const insertVariable = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const variableText = '{{variable}}';

    const newContent = 
      content.substring(0, start) + 
      variableText + 
      content.substring(end);

    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + 8);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-700/50 p-10 w-full max-w-3xl flex flex-col max-h-[85vh] transition-colors"
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tight">
            <div className="bg-gradient-to-br from-brand-400 to-indigo-600 dark:from-brand-600 dark:to-indigo-800 p-3 rounded-2xl shadow-lg shadow-brand-500/30">
              <Wand2 className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            {prompt ? t.editPrompt : t.newPrompt}
          </h2>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            type="button" 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all shadow-inner"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-8 flex-1 overflow-y-auto pr-4 pb-4 custom-scrollbar">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 tracking-wide">{t.title}</label>
              <input
                autoFocus={!prompt}
                type="text"
                className="w-full bg-slate-100/50 dark:bg-slate-950/50 border-2 border-slate-200/50 dark:border-slate-800/50 rounded-2xl px-6 py-4 text-slate-900 dark:text-slate-100 text-lg focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 font-bold shadow-inner"
                placeholder={t.title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-end mb-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide">{t.content}</label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={insertVariable}
                  className="flex items-center space-x-2 text-sm font-bold bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 px-4 py-2 rounded-xl transition-all shadow-sm border border-brand-200 dark:border-brand-800"
                  title={t.insertVariable}
                >
                  <Type className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.insertVariable}</span>
                </motion.button>
              </div>
              <textarea
                ref={textareaRef}
                className="w-full flex-1 min-h-[260px] bg-slate-100/50 dark:bg-slate-950/50 border-2 border-slate-200/50 dark:border-slate-800/50 rounded-3xl px-6 py-6 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all font-mono text-[16px] leading-loose resize-y custom-scrollbar placeholder:text-slate-400 shadow-inner"
                placeholder={t.promptPlaceholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 p-1.5 rounded-lg shadow-sm">💡</span> {t.variableHelp}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-base font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all shadow-inner border border-transparent"
            >
              {t.cancel}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="px-8 py-4 text-base font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl hover:bg-black dark:hover:bg-slate-100 transition-all disabled:opacity-50 disabled:shadow-none shadow-xl shadow-slate-900/20 dark:shadow-white/20"
            >
              {t.savePrompt}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
