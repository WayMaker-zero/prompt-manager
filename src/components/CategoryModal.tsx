import { useState } from 'react';
import { X } from 'lucide-react';

interface CategoryModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function CategoryModal({ onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
