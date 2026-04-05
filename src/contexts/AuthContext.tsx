import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, mockUsers } from '@/data/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, role: User['role']) => boolean;
  logout: () => void;
  switchRole: (role: User['role']) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    // For demo: create a customer user for any email
    const newUser: User = {
      id: `u${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+91 00000 00000',
      role: 'customer',
      address: 'Bengaluru, India',
    };
    setUser(newUser);
    return true;
  };

  const register = (name: string, email: string, phone: string, role: User['role']): boolean => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      phone,
      role,
      address: 'Bengaluru, India',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  const switchRole = (role: User['role']) => {
    if (user) {
      const roleUser = mockUsers.find(u => u.role === role) || { ...user, role };
      setUser({ ...roleUser, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
