import { useState } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface CategoryModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function CategoryModal({ onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('');
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 w-full max-w-sm transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.newCategory}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onSave(name.trim());
          }}
        >
          <input
            autoFocus
            type="text"
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium mb-8"
            placeholder={t.categoryName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
