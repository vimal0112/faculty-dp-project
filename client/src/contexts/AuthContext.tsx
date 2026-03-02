import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

export type UserRole = 'admin' | 'faculty' | 'hod' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('user-id');
      if (userId) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.user) {
            setUser({
              id: response.user._id || response.user.id,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role,
              department: response.user.department,
            });
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('user-id');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      if (!email || !password || !role) {
        return false;
      }

      const response = await authAPI.login(email, password, role);
      
      if (response.user) {
        const userData: User = {
          id: response.user.id || response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          department: response.user.department,
        };
        
        setUser(userData);
        localStorage.setItem('user-id', userData.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user-id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
