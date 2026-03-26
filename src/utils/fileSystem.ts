import { get, set, del } from 'idb-keyval';
import type { AppData } from '../types';

const FILE_HANDLE_KEY = 'prompt-manager-file-handle';

const defaultData: AppData = {
  categories: [
    {
      id: 'default',
      name: 'General',
      prompts: [
        {
          id: '1',
          title: 'Translate Text',
          content: 'Translate the following text to {{language}}: {{text}}'
        }
      ]
    }
  ]
};

export async function getStoredHandle(): Promise<FileSystemFileHandle | undefined> {
  return await get<FileSystemFileHandle>(FILE_HANDLE_KEY);
}

export async function verifyPermission(fileHandle: FileSystemFileHandle, readWrite: boolean): Promise<boolean> {
  const options: FileSystemHandlePermissionDescriptor = {};
  if (readWrite) {
    options.mode = 'readwrite';
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}

export async function openFilePicker(): Promise<FileSystemFileHandle | null> {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });
    await set(FILE_HANDLE_KEY, fileHandle);
    return fileHandle;
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error('Error opening file:', err);
    }
    return null;
  }
}

export async function saveNewFilePicker(data?: AppData): Promise<FileSystemFileHandle | null> {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'prompts.json',
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });
    await set(FILE_HANDLE_KEY, fileHandle);
    if (data) {
      await writeFile(fileHandle, data);
    } else {
      await writeFile(fileHandle, defaultData);
    }
    return fileHandle;
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error('Error saving new file:', err);
    }
    return null;
  }
}

export async function readFile(fileHandle: FileSystemFileHandle): Promise<AppData> {
  const file = await fileHandle.getFile();
  const text = await file.text();
  if (!text) return defaultData;
  try {
    return JSON.parse(text) as AppData;
  } catch (e) {
    console.error('Failed to parse JSON', e);
    return defaultData;
  }
}

export async function writeFile(fileHandle: FileSystemFileHandle, data: AppData): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
}

export async function disconnectFile() {
  await del(FILE_HANDLE_KEY);
}
