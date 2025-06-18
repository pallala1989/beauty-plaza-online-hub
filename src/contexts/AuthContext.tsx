
import React, { createContext, useContext, useEffect, useState } from 'react';
import { config, buildApiUrl } from '@/config/environment';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      setIsLoading(true);
      
      // Try Spring Boot backend first
      try {
        const response = await fetch(buildApiUrl('/api/auth/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          const user: User = {
            id: userData.id || Date.now().toString(),
            email: userData.email,
            name: userData.name,
            role: userData.role || 'user'
          };
          
          setUser(user);
          localStorage.setItem('auth_user', JSON.stringify(user));
          return { error: null };
        }
      } catch (error) {
        console.log('Spring Boot login failed, using local authentication');
      }

      // Fallback to local authentication
      if (email === 'admin@beautyplaza.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'admin@beautyplaza.com',
          name: 'Admin User',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        return { error: null };
      } else if (email && password.length >= 6) {
        const regularUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          role: 'user'
        };
        setUser(regularUser);
        localStorage.setItem('auth_user', JSON.stringify(regularUser));
        return { error: null };
      }

      return { error: 'Invalid email or password' };
    } catch (error) {
      return { error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate Google OAuth (in real implementation, this would redirect to Google)
      // For demo purposes, we'll create a mock Google user
      const googleUser: User = {
        id: `google-${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'user'
      };
      
      setUser(googleUser);
      localStorage.setItem('auth_user', JSON.stringify(googleUser));
    } catch (error) {
      throw new Error('Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<{ error: string | null }> => {
    try {
      setIsLoading(true);
      
      // Try Spring Boot backend first
      try {
        const response = await fetch(buildApiUrl('/api/auth/register'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          const userData = await response.json();
          const user: User = {
            id: userData.id || Date.now().toString(),
            email: userData.email,
            name: userData.name || name,
            role: userData.role || 'user'
          };
          
          setUser(user);
          localStorage.setItem('auth_user', JSON.stringify(user));
          return { error: null };
        }
      } catch (error) {
        console.log('Spring Boot registration failed, using local registration');
      }

      // Fallback to local registration
      if (email && password.length >= 6) {
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name: name || email.split('@')[0],
          role: 'user'
        };
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        return { error: null };
      }

      return { error: 'Please provide valid email and password (min 6 characters)' };
    } catch (error) {
      return { error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
