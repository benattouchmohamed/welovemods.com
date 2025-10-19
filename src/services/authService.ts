import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<boolean> => {
  try {
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }
    
    // Check if admin exists, is active, and password matches
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("active", true)
      .single();
    
    if (adminError) {
      // Admin not found or not active
      toast.error("Invalid credentials or inactive account");
      return false;
    }
    
    // Compare provided password with stored password
    if (email === adminData.email && password === adminData.password) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_name', adminData.name);
      localStorage.setItem('admin_role', adminData.role);
      
      toast.success(`Signed in successfully as ${adminData.role}`);
      return true;
    } else {
      toast.error("Invalid credentials");
      return false;
    }
  } catch (error) {
    console.error("Unexpected error during sign in:", error);
    toast.error("An unexpected error occurred during sign in");
    return false;
  }
};

// Sign out
export const signOut = async (): Promise<boolean> => {
  try {
    // Clear local authentication
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_name');
    localStorage.removeItem('admin_role');
    
    toast.success("Signed out successfully");
    return true;
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    toast.error("An unexpected error occurred during sign out");
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

// Get admin email
export const getAdminEmail = (): string | null => {
  return localStorage.getItem('admin_email');
};

// Get admin name
export const getAdminName = (): string | null => {
  return localStorage.getItem('admin_name');
};

// Get admin role
export const getAdminRole = (): string | null => {
  return localStorage.getItem('admin_role');
};

// Get current session (for AuthContext)
export const getCurrentSession = async (): Promise<Session | null> => {
  const isAuth = await isAuthenticated();
  if (isAuth) {
    // Create a mock session object for local authentication
    const email = getAdminEmail() || 'admin@example.com';
    const name = getAdminName() || 'Administrator';
    const role = getAdminRole() || 'Admin';
    
    return {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {
        id: 'admin-id',
        email: email,
        app_metadata: {},
        user_metadata: {
          name: name,
          role: role
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }
    } as Session;
  }
  return null;
};

// Auth state change listener (for AuthContext)
export const onAuthStateChange = (callback: (session: Session | null) => void) => {
  // Initial call with current auth state
  const checkAndUpdate = async () => {
    const session = await getCurrentSession();
    callback(session);
  };
  
  checkAndUpdate();
  
  // Set up listener for storage changes
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'admin_authenticated') {
      checkAndUpdate();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return mock subscription object
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          window.removeEventListener('storage', handleStorageChange);
        }
      }
    }
  };
};
