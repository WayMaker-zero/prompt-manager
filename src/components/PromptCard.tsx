import { useState, useMemo } from 'react';
import type { Prompt } from '../types';
import { Copy, Edit2, Trash2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Parse content to find text segments and variables
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
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleVarChange = (name: string, value: string) => {
    setVarValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4 gap-2">
        <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">
          {prompt.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-50/50 rounded-lg p-4 mb-4 text-sm text-gray-700 leading-relaxed font-mono overflow-y-auto max-h-64 border border-gray-100">
        {parsedContent.map((part) => {
          if (part.type === 'var') {
            return (
              <span key={part.id} className="relative inline-block mx-1 group align-middle">
                <input
                  type="text"
                  placeholder={part.value}
                  value={varValues[part.value] || ''}
                  onChange={(e) => handleVarChange(part.value, e.target.value)}
                  className="w-24 focus:w-40 transition-all duration-300 ease-in-out px-2 py-1 text-xs text-blue-800 bg-blue-100 border-b-2 border-blue-400 focus:border-blue-600 outline-none placeholder-blue-300 rounded-t-md font-sans"
                />
              </span>
            );
          }
          return <span key={part.id} className="whitespace-pre-wrap">{part.value}</span>;
        })}
      </div>

      <button
        onClick={handleCopy}
        className={twMerge(
          clsx(
            "w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg font-medium transition text-sm",
            copied
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Prompt</span>
          </>
        )}
      </button>
    </div>
  );
}
