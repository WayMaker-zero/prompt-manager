import { useState, useRef, useEffect } from 'react';
import type { Prompt } from '../types';
import { X, Type, Wand2 } from 'lucide-react';

interface PromptModalProps {
  prompt?: Prompt;
  onClose: () => void;
  onSave: (promptData: Omit<Prompt, 'id'>) => void;
}

export default function PromptModal({ prompt, onClose, onSave }: PromptModalProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [content, setContent] = useState(prompt?.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!prompt) setTitle('New Prompt');
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
    
    // Set cursor selection to 'variable' part for easy renaming
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + 8); // 'variable' is 8 chars
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-500" />
            {prompt ? 'Edit Prompt' : 'Create Prompt'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                autoFocus={!prompt}
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Translate Text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-700">Prompt Content</label>
                <button
                  type="button"
                  onClick={insertVariable}
                  className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1.5 rounded transition"
                  title="Insert a {{variable}} placeholder"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Insert Variable</span>
                </button>
              </div>
              <textarea
                ref={textareaRef}
                className="w-full flex-1 min-h-[200px] border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono text-sm leading-relaxed resize-y"
                placeholder="Write your prompt here... Use {{variable}} to create fillable blanks."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Wrap words in double curly braces like <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">{"{{language}}"}</code> to create fillable inputs.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
            >
              Save Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
