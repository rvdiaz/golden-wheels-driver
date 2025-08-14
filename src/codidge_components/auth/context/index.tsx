import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IAuthModuleKeys } from '../interfaces';

interface AuthContextState {
  currentView: IAuthModuleKeys;
  setCurrentView: (view: IAuthModuleKeys) => void;

  // Data to pass between screens (like email for verification)
  tempData: Partial<{ email: string; userId: string; [key: string]: any }>;
  setTempData: (data: Partial<{ email: string; userId: string; [key: string]: any }>) => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<IAuthModuleKeys>(IAuthModuleKeys.signIn);
  const [tempData, setTempDataState] = useState<Partial<{ email: string; userId: string }>>({});

  const setTempData = (data: Partial<{ email: string; userId: string }>) => {
    setTempDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ currentView, setCurrentView, tempData, setTempData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
