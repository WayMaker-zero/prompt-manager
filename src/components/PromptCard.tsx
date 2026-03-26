import { useState, useMemo } from 'react';
import type { Prompt } from '../types';
import { Copy, Edit2, Trash2, Check, GripVertical } from 'lucide-react';
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900/80 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 flex flex-col h-[400px] transition-shadow duration-300 relative group"
    >
      <div className="flex justify-between items-start mb-5 gap-4">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-50 line-clamp-2 leading-snug flex-1 tracking-tight">
          {prompt.title}
        </h3>
        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-brand-100)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "tween", duration: 0.2 }}
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title={t.edit}
          >
            <Edit2 className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "tween", duration: 0.2 }}
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title={t.delete}
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl p-5 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans overflow-y-auto border border-slate-200/60 dark:border-slate-800 shadow-inner custom-scrollbar relative">
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <GripVertical className="w-5 h-5" />
        </div>
        <p className="whitespace-pre-wrap leading-8">
          {parsedContent.map((part) => {
            if (part.type === 'var') {
              return (
                <span key={part.id} className="relative inline-flex mx-1 group/var align-middle pb-1">
                  <input
                    type="text"
                    placeholder={part.value}
                    value={varValues[part.value] || ''}
                    onChange={(e) => handleVarChange(part.value, e.target.value)}
                    className="prompt-variable-input"
                  />
                </span>
              );
            }
            return <span key={part.id}>{part.value}</span>;
          })}
        </p>
      </div>
      
      {/* Floating minimal copy button */}
      <div className="absolute bottom-6 right-6 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={twMerge(
            clsx(
              "flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm shadow-xl backdrop-blur-md",
              copied
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-slate-900/90 text-white hover:bg-black dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-slate-900/20 dark:shadow-white/10 border border-slate-800/50 dark:border-white/20"
            )
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" strokeWidth={3} />
                <span>{t.copied}</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
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
