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
        // In a real app, you'd validate the password. Here we just log in.
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        const userData = storedUsers[email];

        // For this mock, we'll just log in if the user exists, ignoring password for simplicity
        if (userData) {
            const loggedInUser = { id: userData.id, name: userData.name, email };
            localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
        } else {
            // For demo purposes, let's create a new user if not found during login
            register(`User ${email.split('@')[0]}`, email, password);
        }
    };

    const register = (name: string, email: string, password?: string) => {
        const newUser: User = { id: `user_${Date.now()}`, name, email };
        
        // Store user in a mock "users" database in localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        storedUsers[email] = { ...newUser, password }; // Storing password for mock change later
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Log the new user in
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
