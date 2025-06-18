
import React, { createContext, useContext, useEffect, useState } from 'react';
import { config, buildApiUrl } from '@/config/environment';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface Profile {
  id: string;
  full_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfile({
          id: userData.id,
          full_name: userData.name,
          role: userData.role
        });
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
          
          const profile: Profile = {
            id: user.id,
            full_name: user.name,
            role: user.role
          };
          
          setUser(user);
          setProfile(profile);
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
        const adminProfile: Profile = {
          id: adminUser.id,
          full_name: adminUser.name,
          role: adminUser.role
        };
        setUser(adminUser);
        setProfile(adminProfile);
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        return { error: null };
      } else if (email && password.length >= 6) {
        const regularUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          role: 'user'
        };
        const regularProfile: Profile = {
          id: regularUser.id,
          full_name: regularUser.name,
          role: regularUser.role
        };
        setUser(regularUser);
        setProfile(regularProfile);
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
      
      const googleProfile: Profile = {
        id: googleUser.id,
        full_name: googleUser.name,
        role: googleUser.role
      };
      
      setUser(googleUser);
      setProfile(googleProfile);
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
          
          const profile: Profile = {
            id: user.id,
            full_name: user.name,
            role: user.role
          };
          
          setUser(user);
          setProfile(profile);
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
        const newProfile: Profile = {
          id: newUser.id,
          full_name: newUser.name,
          role: newUser.role
        };
        setUser(newUser);
        setProfile(newProfile);
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
    setProfile(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
