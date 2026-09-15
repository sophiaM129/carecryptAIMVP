import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextValue {
  isLoggedIn: boolean;
  userName: string;
  login: (name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_auth';
const NAME_KEY = 'cc_user_name';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );
  const [userName, setUserName] = useState<string>(
    () => localStorage.getItem(NAME_KEY) || ''
  );

  const login = useCallback((name?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    if (name) {
      setUserName(name);
      localStorage.setItem(NAME_KEY, name);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
