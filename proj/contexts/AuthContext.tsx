'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';  

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean; // Add isAdmin flag
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add isAdmin state
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Add admin state
  const router = useRouter();
  const { showToast } = useToast(); // Add this line to access the toast functionality

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Try to get token from localStorage first (for backwards compatibility)
        let storedToken = localStorage.getItem('auth-token');
        let storedUser = localStorage.getItem('auth-user');
        
        // If token exists, use it to set the auth state
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsAdmin(parsedUser.isAdmin || false);
        } else {
          // If not in localStorage, check if we have a session by making an API call
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Important: include cookies
          });
          
          if (response.ok) {
            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            setIsAdmin(data.user.isAdmin || false);
            
            // Also store in localStorage for backwards compatibility
            localStorage.setItem('auth-token', data.token);
            localStorage.setItem('auth-user', JSON.stringify(data.user));
          } else {
            clearAuthState();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false); // Reset admin state on logout
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    document.cookie = 'auth-token=; path=/; max-age=0';
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Special case for admin
      if (email === 'admin' && password === 'admin123') {
        const adminUser = {
          id: 'admin-id',
          name: 'Administrator',
          email: 'admin@fixu.in',
          isAdmin: true
        };
        
        // Create a mock token for admin
        const adminToken = 'admin-token-' + Date.now();
        
        setToken(adminToken);
        setUser(adminUser);
        setIsAuthenticated(true);
        setIsAdmin(true);
        
        localStorage.setItem('auth-token', adminToken);
        localStorage.setItem('auth-user', JSON.stringify(adminUser));
        document.cookie = `auth-token=${adminToken}; path=/; max-age=604800; SameSite=Lax`;
        
        return;
      }
      
      // Regular user login (existing code)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.isAdmin || false); // Set admin state based on user data

      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('auth-user', JSON.stringify(data.user));
      
      document.cookie = `auth-token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('auth-user', JSON.stringify(data.user));
      
      document.cookie = `auth-token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthState();
    
    // Make a request to the logout API endpoint
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(error => {
      console.error('Error during logout API call:', error);
    });
    
    // Show toast notification for logout
    showToast('Successfully signed out!', 'success');
    
    router.push('/');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
    isAdmin, // Add isAdmin to context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};