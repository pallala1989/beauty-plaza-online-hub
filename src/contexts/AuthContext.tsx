
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  phone?: string;
  role?: 'user' | 'admin';
}

interface Profile {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  phone?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  setAdminBypass: (bypass: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminBypass, setAdminBypass] = useState(false);

  // Check for admin bypass credentials
  const checkAdminBypass = (email: string, password: string) => {
    const adminCredentials = [
      { email: 'admin@beautyplaza.com', password: 'admin123' },
      { email: 'test@admin.com', password: 'admin' },
      { email: 'admin', password: 'admin' }
    ];
    
    return adminCredentials.some(cred => 
      cred.email === email && cred.password === password
    );
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          full_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || session.user.phone || '',
          role: session.user.user_metadata?.role || 'user'
        };
        const profileData: Profile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          full_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || session.user.phone || '',
          role: session.user.user_metadata?.role || 'user'
        };
        setUser(userData);
        setProfile(profileData);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          full_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || session.user.phone || '',
          role: session.user.user_metadata?.role || 'user'
        };
        const profileData: Profile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          full_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || session.user.phone || '',
          role: session.user.user_metadata?.role || 'user'
        };
        setUser(userData);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
          full_name: name || '',
          role: 'user'
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Check for admin bypass first
    if (checkAdminBypass(email, password)) {
      const adminUser: User = {
        id: 'admin-bypass-' + Date.now(),
        email: email,
        name: 'Admin User',
        full_name: 'Admin User',
        phone: '+1234567890',
        role: 'admin'
      };
      const adminProfile: Profile = {
        id: adminUser.id,
        email: email,
        name: 'Admin User',
        full_name: 'Admin User',
        phone: '+1234567890',
        role: 'admin'
      };
      
      setUser(adminUser);
      setProfile(adminProfile);
      setAdminBypass(true);
      setLoading(false);
      
      console.log('Admin bypass activated for:', email);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error };
  };

  const signOut = async () => {
    if (adminBypass) {
      setUser(null);
      setProfile(null);
      setAdminBypass(false);
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });

    if (error) throw error;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isLoading: loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    setAdminBypass
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
