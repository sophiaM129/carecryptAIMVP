import React, { createContext, useContext, useState, useCallback } from 'react';

export interface VaultDocument {
  id: string;
  name: string;
  cat: string;
  hospital: string;
  date: string;
  sizeLabel: string;
  dataUrl: string;
  mimeType: string;
}

interface VaultContextValue {
  documents: VaultDocument[];
  addDocument: (doc: Omit<VaultDocument, 'id' | 'date'>) => void;
  deleteDocument: (id: string) => void;
}

const VaultContext = createContext<VaultContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_vault_documents';

const loadInitial = (): VaultDocument[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore malformed storage
  }
  return [];
};

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<VaultDocument[]>(loadInitial);

  const persist = (docs: VaultDocument[]) => {
    setDocuments(docs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // storage quota exceeded — keep in-memory state even if we can't persist
    }
  };

  const addDocument = useCallback((doc: Omit<VaultDocument, 'id' | 'date'>) => {
    setDocuments(prev => {
      const next: VaultDocument[] = [
        {
          ...doc,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          date: new Date().toISOString(),
        },
        ...prev,
      ];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage quota exceeded — keep in-memory state even if we can't persist
      }
      return next;
    });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => {
      const next = prev.filter(d => d.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return (
    <VaultContext.Provider value={{ documents, addDocument, deleteDocument }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = (): VaultContextValue => {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within a VaultProvider');
  return ctx;
};
