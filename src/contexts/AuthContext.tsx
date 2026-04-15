import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, mockUsers } from '@/data/mock-data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (email: string, password: string, name: string, phone: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: User['role']) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Supabase auth state changes (Google OAuth / email)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const supaUser = session.user;
        const existingMock = mockUsers.find(u => u.email === supaUser.email);
        setUser(existingMock || {
          id: supaUser.id,
          name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
          email: supaUser.email || '',
          phone: supaUser.phone || '+91 00000 00000',
          role: 'customer',
          avatar: supaUser.user_metadata?.avatar_url,
          address: 'Bengaluru, India',
        });
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real email/password login
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Logged in successfully!');
    return true;
  };

  // Real email/password signup
  const signupWithEmail = async (email: string, password: string, name: string, phone: string, role: User['role']): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name, phone, role },
      },
    });
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Account created! Check your email to verify.');
    return true;
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  const switchRole = (role: User['role']) => {
    if (user) {
      const roleUser = mockUsers.find(u => u.role === role) || { ...user, role };
      setUser({ ...roleUser, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, signupWithEmail, logout, switchRole, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
