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
const transformSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
  emailVerified: supabaseUser.email_confirmed_at !== null,
  phone: supabaseUser.phone,
  avatar: supabaseUser.user_metadata?.avatar_url,
});

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
        setAuthState({
          user: transformSupabaseUser(session.user),
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setAuthState({
          user: transformSupabaseUser(session.user),
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
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Verified",
            description: "Check your inbox for the verification link.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data.user) {
        toast({ title: "Login Successful", description: "Welcome back!" });
      }
    } catch (err) {
      const authError = err as AuthError;
      toast({ title: "Login Failed", description: authError.message, variant: "destructive" });
      throw err;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "A verification link has been sent to your email.",
      });
    } catch (err) {
      const authError = err as AuthError;
      toast({ title: "Registration Failed", description: authError.message, variant: "destructive" });
      throw err;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      toast({ title: "Verification Link Resent", description: "Check your email inbox." });
    } catch (err) {
      const authError = err as AuthError;
      toast({ title: "Resend Failed", description: authError.message, variant: "destructive" });
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Logged Out", description: "You have been logged out." });
    } catch (err) {
      const authError = err as AuthError;
      toast({ title: "Logout Failed", description: authError.message, variant: "destructive" });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error("No user logged in");

      const { error } = await supabase.auth.updateUser({ data: { name: data.name, avatar_url: data.avatar } });
      if (error) throw error;

      toast({ title: "Profile Updated", description: "Your profile was successfully updated." });
    } catch (err) {
      const authError = err as AuthError;
      toast({ title: "Update Failed", description: authError.message, variant: "destructive" });
      throw err;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
