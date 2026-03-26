export interface Prompt {
  id: string;
  title: string;
  content: string; // The prompt text with {{variables}}
}

export interface Category {
  id: string;
  name: string;
  prompts: Prompt[];
}

export interface AppData {
  categories: Category[];
}
