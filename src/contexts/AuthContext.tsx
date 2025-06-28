import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, Profile } from '../lib/localStorage';

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setProfile(currentUser);
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.signIn(email, password);
      
      if (result.error) {
        setError(result.error.message);
        return result;
      }

      if (result.data?.user) {
        setUser(result.data.user);
        setProfile(result.data.user);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.signUp(email, password, fullName);

      if (result.error) {
        setError(result.error.message);
        return result;
      }

      if (result.data?.user) {
        setUser(result.data.user);
        setProfile(result.data.user);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    setError(null);
    
    try {
      await AuthService.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      setError(null);
      const result = await AuthService.updateProfile(updates);

      if (!result.error && result.data) {
        setUser(result.data);
        setProfile(result.data);
      } else {
        setError(result.error?.message || 'Update failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update profile failed';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}