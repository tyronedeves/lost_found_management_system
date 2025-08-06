import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { account, DEMO_USERS, UserRole, APPWRITE_CONFIG, ID, createFreshAccount } from "@/lib/appwrite";
import { Models } from "appwrite";

export interface User {
  $id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isAdmin: () => boolean;
  isModerator: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      if (currentUser) {
        // For real users, check if they have admin role based on email or custom attributes
        // You can modify this logic based on how you want to assign admin roles
        let userRole = UserRole.USER;

        // Check if user has admin privileges (you can customize this logic)
        if (
          currentUser.email === 'admin@foundit.com' ||
          currentUser.email?.endsWith('@admin.foundit.com') ||
          currentUser.email === 'walter@foundit.com' ||
          currentUser.email === 'walterenebeli@gmail.com' ||
          currentUser.email?.includes('walter')
        ) {
          userRole = UserRole.ADMIN;
        }

        setUser({
          $id: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name || "User",
          role: userRole,
        });
      }
    } catch (error: any) {
      console.warn('Appwrite authentication check failed:', error.message);

      // If this is Walter trying to access admin, create a demo admin user
      if (error.message?.includes('Failed to fetch')) {
        console.log('Appwrite service unavailable - checking for demo admin access');
        const savedDemoUser = localStorage.getItem('demo-admin-user');
        if (savedDemoUser) {
          try {
            const demoUser = JSON.parse(savedDemoUser);
            setUser(demoUser);
            return;
          } catch (e) {
            console.warn('Failed to parse saved demo user');
          }
        }
      }

      // User is not logged in or auth service unavailable
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process...');

      // Create fresh account instance for login
      const loginAccount = createFreshAccount();
      await loginAccount.createEmailPasswordSession(email, password);

      console.log('Login session created successfully');
      await checkAuth();
    } catch (error: any) {
      console.error("Login error:", error);

      // If Appwrite is unavailable and this is Walter, allow demo admin login
      if (error.message?.includes('Failed to fetch') &&
          (email === 'walter@foundit.com' || email === 'walterenebeli@gmail.com' || email.includes('walter'))) {
        console.log('Appwrite unavailable - creating demo admin session for Walter');

        // Create demo admin user
        const demoAdminUser = {
          $id: 'demo-admin-walter',
          email: email,
          name: 'Walter Enebeli-uzor (Demo Admin)',
          role: UserRole.ADMIN,
        };

        // Save to localStorage and set user
        localStorage.setItem('demo-admin-user', JSON.stringify(demoAdminUser));
        setUser(demoAdminUser);
        return;
      }

      // Provide more user-friendly error messages
      if (error.message?.includes('Failed to fetch') || error.code === 0) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      } else if (error.code === 401) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // Prevent multiple concurrent registration attempts
    if (isRegistering) {
      throw new Error('Registration already in progress. Please wait.');
    }

    setIsRegistering(true);

    try {
      console.log('Starting registration process...');

      // Create a completely fresh account instance
      const freshAccount = createFreshAccount();

      // Generate a unique ID
      const userId = ID.unique();
      console.log('Generated user ID:', userId);

      // Only create the user account - don't attempt auto-login
      const userResponse = await freshAccount.create(userId, email, password, name);
      console.log('User created successfully:', userResponse);

      // Throw a success error to trigger redirect to login
      throw new Error('REGISTRATION_SUCCESS');

    } catch (error: any) {
      console.error("Registration error details:", {
        message: error.message,
        code: error.code,
        type: error.type,
        response: error.response,
        fullError: JSON.stringify(error, null, 2)
      });
      console.error("Full error object:", error);

      // Handle our success case
      if (error.message === 'REGISTRATION_SUCCESS') {
        throw error; // Re-throw to be handled by UI
      }

      // Provide more user-friendly error messages
      if (error.message?.includes('Failed to fetch') || error.code === 0) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      } else if (error.code === 409 || error.message?.includes('user with the same id, email')) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      } else if (error.code === 400) {
        throw new Error('Invalid email or password format. Please check your input and try again.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const logout = async () => {
    try {
      // Clear demo user data if exists
      localStorage.removeItem('demo-admin-user');

      // Real Appwrite logout (may fail if service is down)
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      // Even if the API call fails, clear local state
      console.warn('Logout API call failed, clearing local state');
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.role === UserRole.ADMIN;
  };

  const isModerator = () => {
    return user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMIN;
  };



  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAdmin,
    isModerator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
