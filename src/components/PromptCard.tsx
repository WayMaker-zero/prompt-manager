import { useState, useMemo } from 'react';
import type { Prompt } from '../types';
import { Copy, Trash2, Check, Settings2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useI18n } from '../contexts/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const parsedContent = useMemo(() => {
    const parts = prompt.content.split(/(\{\{.*?\}\})/g);
    return parts.map((part, index) => {
      const match = part.match(/\{\{(.*?)\}\}/);
      if (match) {
        return { type: 'var' as const, value: match[1], id: index };
      }
      return { type: 'text' as const, value: part, id: index };
    });
  }, [prompt.content]);

  const hasVariables = parsedContent.some(p => p.type === 'var');

  const handleCopy = () => {
    let finalPrompt = '';
    for (const part of parsedContent) {
      if (part.type === 'var') {
        finalPrompt += varValues[part.value] || `{{${part.value}}}`;
      } else {
        finalPrompt += part.value;
      }
    }
    navigator.clipboard.writeText(finalPrompt).then(() => {
      setCopied(true);
      toast.success(t.copied, { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleVarChange = (name: string, value: string) => {
    setVarValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white dark:bg-slate-900/80 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col h-[400px] transition-all duration-300 relative group overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/10 hover:-translate-y-1"
    >
      {/* Top Header Section */}
      <div className="flex justify-between items-start px-8 pt-8 pb-4 gap-4 z-10 shrink-0">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 min-h-[20px]">
            {hasVariables && (
              <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                Interactive
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-50 line-clamp-2 leading-snug tracking-tight">
            {prompt.title}
          </h3>
        </div>
        
        {/* Subtle edit controls that appear on hover */}
        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-700/50">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-brand-100)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title={t.edit}
          >
            <Settings2 className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title={t.delete}
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-8 pb-8 text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans overflow-y-auto custom-scrollbar relative z-0">
        <p className="whitespace-pre-wrap leading-8 pb-20">
          {parsedContent.map((part) => {
            if (part.type === 'var') {
              return (
                <span key={part.id} className="relative inline-flex mx-1 group/var align-middle pb-1">
                  <input
                    type="text"
                    placeholder={part.value}
                    value={varValues[part.value] || ''}
                    onChange={(e) => handleVarChange(part.value, e.target.value)}
                    className="prompt-variable-input shadow-sm"
                  />
                </span>
              );
            }
            return <span key={part.id}>{part.value}</span>;
          })}
        </p>
      </div>
      
      {/* Bottom Dock / Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 dark:to-transparent z-10 pt-16 pointer-events-none flex justify-center items-end">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={twMerge(
            clsx(
              "pointer-events-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold transition-all duration-300 text-[14px] shadow-xl border backdrop-blur-md",
              copied
                ? "bg-emerald-500 text-white shadow-emerald-500/20 border-emerald-400 dark:border-emerald-600"
                : "bg-slate-900/95 text-white hover:bg-black dark:bg-white/95 dark:text-slate-900 dark:hover:bg-white border-transparent dark:border-slate-200/50"
            )
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" strokeWidth={3} />
                <span>{t.copied}</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" strokeWidth={2.5} />
                <span>{t.copyPrompt}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
