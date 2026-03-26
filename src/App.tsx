import { useState, useEffect } from 'react';
import {
  getStoredHandle,
  verifyPermission,
  openFilePicker,
  saveNewFilePicker,
  readFile,
  writeFile,
  disconnectFile
} from './utils/fileSystem';
import type { AppData, Category } from './types';
import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';
import WelcomeScreen from './components/WelcomeScreen';
import { v4 as uuidv4 } from 'uuid';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [fileHandle, setFileHandle] = useState<any>(null);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const handle = await getStoredHandle();
      if (handle) {
        setFileHandle(handle);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const handleRestoreConnection = async () => {
    if (!fileHandle) return;
    try {
      const granted = await verifyPermission(fileHandle, true);
      if (granted) {
        const data = await readFile(fileHandle);
        setAppData(data);
        if (data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
        toast.success('File connected successfully');
      } else {
        toast.error("Permission denied. Please open the file manually.");
      }
    } catch (e) {
      toast.error('Failed to restore connection');
    }
  };

  const handleOpenFile = async () => {
    try {
      const handle = await openFilePicker();
      if (handle) {
        setFileHandle(handle);
        const data = await readFile(handle);
        setAppData(data);
        if (data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
        toast.success('File opened successfully');
      }
    } catch (e) {
      toast.error('Failed to open file');
    }
  };

  const handleCreateFile = async () => {
    try {
      const handle = await saveNewFilePicker();
      if (handle) {
        setFileHandle(handle);
        const data = await readFile(handle);
        setAppData(data);
        if (data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
        toast.success('New file created successfully');
      }
    } catch (e) {
      toast.error('Failed to create file');
    }
  };

  const handleDisconnect = async () => {
    await disconnectFile();
    setFileHandle(null);
    setAppData(null);
    setSelectedCategoryId(null);
    toast.info('File disconnected');
  };

  const syncData = async (newData: AppData) => {
    setAppData(newData);
    if (fileHandle) {
      try {
        await writeFile(fileHandle, newData);
      } catch (e) {
        toast.error('Failed to save changes');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-base)]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-16 w-16 border-[4px] border-slate-200 border-t-brand-600 dark:border-slate-800 dark:border-t-brand-500"
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!appData ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeScreen
            fileHandle={fileHandle}
            onRestore={handleRestoreConnection}
            onOpen={handleOpenFile}
            onCreate={handleCreateFile}
            onDisconnect={handleDisconnect}
          />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="flex flex-col h-screen w-full bg-[var(--bg-base)] overflow-hidden transition-colors selection:bg-brand-500/30 font-sans"
        >
          {/* Note: Header removed from layout, embedded in Welcome/Sidebar/Main Area logic */}
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar
              categories={appData.categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              onAddCategory={(name) => {
                const newCategory: Category = { id: uuidv4(), name, prompts: [] };
                const newData = { ...appData, categories: [...appData.categories, newCategory] };
                syncData(newData);
                setSelectedCategoryId(newCategory.id);
                toast.success('Category added');
              }}
              onDeleteCategory={(id) => {
                const newData = { ...appData, categories: appData.categories.filter(c => c.id !== id) };
                syncData(newData);
                if (selectedCategoryId === id) {
                  setSelectedCategoryId(newData.categories[0]?.id || null);
                }
                toast.success('Category deleted');
              }}
              onDisconnect={handleDisconnect}
            />
            
            <MainArea
              category={appData.categories.find(c => c.id === selectedCategoryId)}
              onUpdateCategory={(updatedCategory) => {
                const newData = {
                  ...appData,
                  categories: appData.categories.map(c => 
                    c.id === updatedCategory.id ? updatedCategory : c
                  )
                };
                syncData(newData);
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'font-sans font-medium rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl',
          }}
        />
        <AppContent />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
