import { useState } from 'react';
import type { Category, Prompt } from '../types';
import PromptCard from './PromptCard';
import PromptModal from './PromptModal';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MainAreaProps {
  category?: Category;
  onUpdateCategory: (category: Category) => void;
}

export default function MainArea({ category, onUpdateCategory }: MainAreaProps) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (!category) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400">Select or create a category</p>
      </div>
    );
  }

  const handleSavePrompt = (promptData: Omit<Prompt, 'id'>) => {
    if (editingPrompt) {
      // Edit existing
      const updatedPrompts = category.prompts.map((p) =>
        p.id === editingPrompt.id ? { ...p, ...promptData } : p
      );
      onUpdateCategory({ ...category, prompts: updatedPrompts });
    } else {
      // Create new
      const newPrompt: Prompt = { id: uuidv4(), ...promptData };
      onUpdateCategory({
        ...category,
        prompts: [...category.prompts, newPrompt],
      });
    }
    setEditingPrompt(null);
    setIsCreating(false);
  };

  const handleDeletePrompt = (id: string) => {
    onUpdateCategory({
      ...category,
      prompts: category.prompts.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      <div className="flex-shrink-0 px-8 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {category.prompts.length} prompt{category.prompts.length !== 1 && 's'}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Prompt</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {category.prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={() => setEditingPrompt(prompt)}
              onDelete={() => handleDeletePrompt(prompt.id)}
            />
          ))}
          
          {category.prompts.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 mb-4">No prompts in this category yet.</p>
              <button
                onClick={() => setIsCreating(true)}
                className="text-blue-600 font-medium hover:underline"
              >
                Create your first prompt
              </button>
            </div>
          )}
        </div>
      </div>

      {(isCreating || editingPrompt) && (
        <PromptModal
          prompt={editingPrompt || undefined}
          onClose={() => {
            setIsCreating(false);
            setEditingPrompt(null);
          }}
          onSave={handleSavePrompt}
        />
      )}
    </div>
  );
}
