import { useEffect, useId, useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsPopover() {
  const { t } = useI18n();
  const { selectToCopyEnabled, setSelectToCopyEnabled } = useSettings();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const switchId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
        title={t.settings}
        aria-label={t.settings}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t.settings}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-full mt-2 w-72 z-50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl p-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
              {t.settings}
            </h3>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <label
                  htmlFor={switchId}
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  {t.selectToCopy}
                </label>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t.selectToCopyHint}
                </p>
              </div>

              <button
                id={switchId}
                type="button"
                role="switch"
                aria-checked={selectToCopyEnabled}
                onClick={() => setSelectToCopyEnabled(!selectToCopyEnabled)}
                className={[
                  'relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
                  selectToCopyEnabled
                    ? 'bg-brand-600 dark:bg-brand-500'
                    : 'bg-slate-300 dark:bg-slate-600',
                ].join(' ')}
              >
                <span
                  aria-hidden
                  className={[
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                    selectToCopyEnabled ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
