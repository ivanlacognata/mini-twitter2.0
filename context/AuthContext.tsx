
'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, register as apiRegister } from '@/lib/api'; 

export interface User { 
    id: string; 
    username: string; 
    email: string; 
}

export interface LoginData { 
    email: string; 
    password: string; 
}

export interface RegisterData extends LoginData { 
    username: string; 
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    try {
      const loggedUser = await apiLogin(data); 
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      router.push('/'); 
    } catch (error) {

      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const newUser = await apiRegister(data);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      router.push('/'); 
    } catch (error) {

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {

      throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
    }
    return context;
  };