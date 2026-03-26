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
import type { AppData, Category, } from './types';
import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';
import { Database, FolderOpen, Plus} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
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
    const granted = await verifyPermission(fileHandle, true);
    if (granted) {
      const data = await readFile(fileHandle);
      setAppData(data);
      if (data.categories.length > 0) {
        setSelectedCategoryId(data.categories[0].id);
      }
    } else {
      alert("Permission denied. Please open the file manually.");
    }
  };

  const handleOpenFile = async () => {
    const handle = await openFilePicker();
    if (handle) {
      setFileHandle(handle);
      const data = await readFile(handle);
      setAppData(data);
      if (data.categories.length > 0) {
        setSelectedCategoryId(data.categories[0].id);
      }
    }
  };

  const handleCreateFile = async () => {
    const handle = await saveNewFilePicker();
    if (handle) {
      setFileHandle(handle);
      const data = await readFile(handle);
      setAppData(data);
      if (data.categories.length > 0) {
        setSelectedCategoryId(data.categories[0].id);
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectFile();
    setFileHandle(null);
    setAppData(null);
    setSelectedCategoryId(null);
  };

  const syncData = async (newData: AppData) => {
    setAppData(newData);
    if (fileHandle) {
      await writeFile(fileHandle, newData);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!appData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Manager</h1>
            <p className="text-gray-500 text-sm">Organize and manage your AI prompts locally</p>
          </div>

          <div className="space-y-4">
            {fileHandle ? (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Found previously saved connection to <strong>{fileHandle.name}</strong>
                </p>
                <button
                  onClick={handleRestoreConnection}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span>Restore Connection</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  Forget this file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleOpenFile}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span>Open Existing File</span>
                </button>
                <button
                  onClick={handleCreateFile}
                  className="w-full flex items-center justify-center space-x-2 bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        categories={appData.categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        onAddCategory={(name) => {
          const newCategory: Category = { id: uuidv4(), name, prompts: [] };
          const newData = { ...appData, categories: [...appData.categories, newCategory] };
          syncData(newData);
          setSelectedCategoryId(newCategory.id);
        }}
        onDeleteCategory={(id) => {
          const newData = { ...appData, categories: appData.categories.filter(c => c.id !== id) };
          syncData(newData);
          if (selectedCategoryId === id) {
            setSelectedCategoryId(newData.categories[0]?.id || null);
          }
        }}
        onDisconnect={handleDisconnect}
        fileName={fileHandle?.name}
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
  );
}

export default App;
