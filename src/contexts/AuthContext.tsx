import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/utils';
import { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Transform Supabase user to our User type
const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    emailVerified: supabaseUser.email_confirmed_at !== null,
    phone: supabaseUser.phone,
    avatar: supabaseUser.user_metadata?.avatar_url,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const user = transformSupabaseUser(session.user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const user = transformSupabaseUser(session.user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if user needs to confirm email
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and click the verification link before signing in.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Aadhaar Link Docs",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Login Failed",
        description: authError.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "A verification link has been sent to your email. Please check your inbox and click the link to verify your account.",
      });

    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Registration Failed",
        description: authError.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "Verification Link Resent",
        description: "A new verification link has been sent to your email",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Resend Failed",
        description: authError.message || "Failed to resend verification link",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Logout Failed",
        description: authError.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('No user logged in');

      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          avatar_url: data.avatar,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Update Failed",
        description: authError.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        session,
        login,
        register,
        logout,
        resendConfirmation,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}