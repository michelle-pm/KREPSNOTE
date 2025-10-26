import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  logout: () => void;
  register: (name: string, email: string, password?: string) => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Using a mock user state that persists in localStorage for the demo
const useMockAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      try {
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('mockUser');
      }
    }, []);

    const isAuthenticated = !!user;

    const login = (email: string, password?: string) => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        const userData = storedUsers[email];

        if (!userData) {
            throw new Error("Пользователь с таким email не найден.");
        }
        
        if (userData.password !== password) {
            throw new Error("Неверный пароль.");
        }

        const loggedInUser: User = { id: userData.id, name: userData.name, email };
        localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
    };

    const register = (name: string, email: string, password?: string) => {
        if (!password || password.length < 8) {
            throw new Error("Пароль должен содержать не менее 8 символов.");
        }

        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (storedUsers[email]) {
            throw new Error("Пользователь с таким email уже существует.");
        }
        
        const newUser: User = { id: `user_${Date.now()}`, name, email };
        
        storedUsers[email] = { ...newUser, password };
        localStorage.setItem('users', JSON.stringify(storedUsers));

        localStorage.setItem('mockUser', JSON.stringify(newUser));
        setUser(newUser);
    };
    
    const updateUser = (updatedUser: Partial<User>) => {
      if(user){
        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));

        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (storedUsers[user.email]) {
          storedUsers[user.email] = { ...storedUsers[user.email], ...updatedUser };
          localStorage.setItem('users', JSON.stringify(storedUsers));
        }
      }
    };


    const logout = () => {
        localStorage.removeItem('mockUser');
        setUser(null);
    };
    
    return { user, isAuthenticated, login, logout, register, updateUser };
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useMockAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};