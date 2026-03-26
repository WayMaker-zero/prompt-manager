import { useState } from 'react';
import type { Category } from '../types';
import { Folder, Plus, LogOut, Trash2 } from 'lucide-react';
import CategoryModal from './CategoryModal';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onDisconnect: () => void;
  fileName?: string;
}

export default function Sidebar({
  categories,
  selectedCategoryId,
  onSelect,
  onAddCategory,
  onDeleteCategory,
  onDisconnect,
  fileName
}: SidebarProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-64 bg-gray-50 border-r flex flex-col h-full shrink-0">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <Folder className="w-5 h-5 text-blue-500" />
          Categories
        </h2>
        {fileName && (
          <p className="text-xs text-gray-500 truncate mt-2" title={fileName}>
            📄 {fileName}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {categories.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition ${
              selectedCategoryId === c.id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span className="text-sm truncate pr-2">{c.name}</span>
            {categories.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(c.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition mt-4 border border-dashed border-gray-300"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onDisconnect}
          className="w-full flex items-center justify-center space-x-2 text-sm text-gray-500 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect File</span>
        </button>
      </div>

      {isAdding && (
        <CategoryModal
          onClose={() => setIsAdding(false)}
          onSave={(name) => {
            onAddCategory(name);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
}
