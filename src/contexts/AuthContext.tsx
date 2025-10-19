
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { getCurrentSession, onAuthStateChange } from "@/services/authService";

interface AuthContextProps {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = onAuthStateChange((session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Get the initial session
    getCurrentSession().then((session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
