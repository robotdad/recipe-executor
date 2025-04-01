import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Core types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  roles: string[];
  metadata?: Record<string, any>;
}

export interface LoginOptions {
  redirect?: boolean;
  redirectUrl?: string;
}

export interface LogoutOptions {
  redirectUrl?: string;
}

export interface SignupOptions {
  email: string;
  password: string;
  name: string;
}

// Auth provider interface
export interface AuthProvider {
  login(options?: LoginOptions): Promise<UserProfile>;
  logout(options?: LogoutOptions): Promise<void>;
  signup(options?: SignupOptions): Promise<UserProfile>;
  getUser(): UserProfile | null;
  isAuthenticated(): boolean;
  getToken(): string | null;
  refreshToken(): Promise<string>;
  updateProfile(data: Partial<UserProfile>): Promise<UserProfile>;
  resetPassword(email: string): Promise<void>;
}

// Auth context
export interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (options?: LoginOptions) => Promise<UserProfile>;
  logout: (options?: LogoutOptions) => Promise<void>;
  signup: (options?: SignupOptions) => Promise<UserProfile>;
  getToken: () => string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Auth provider props
export interface AuthProviderProps {
  provider: AuthProvider;
  children: React.ReactNode;
}

// Auth provider component
export function AuthProvider({ provider, children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = provider.getUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication error'));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [provider]);

  // Auth methods
  const login = useCallback(
    async (options?: LoginOptions) => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await provider.login(options);
        setUser(user);
        return user;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Login failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const logout = useCallback(
    async (options?: LogoutOptions) => {
      try {
        setIsLoading(true);
        await provider.logout(options);
        setUser(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Logout failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const signup = useCallback(
    async (options: SignupOptions) => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await provider.signup(options);
        setUser(user);
        return user;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Signup failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const getToken = useCallback(() => {
    return provider.getToken();
  }, [provider]);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      try {
        setIsLoading(true);
        const updatedUser = await provider.updateProfile(data);
        setUser(updatedUser);
        return updatedUser;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Profile update failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);
        await provider.resetPassword(email);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Password reset failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    signup,
    getToken,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Auth hooks
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUser(): UserProfile | null {
  const { user } = useAuth();
  return user;
}

export function useLogin(): (options?: LoginOptions) => Promise<UserProfile> {
  const { login } = useAuth();
  return login;
}

export function useLogout(): (options?: LogoutOptions) => Promise<void> {
  const { logout } = useAuth();
  return logout;
}

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles,
  fallback = <div>You must be logged in to view this page</div>
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      user?.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return <div>You don't have permission to access this page</div>;
    }
  }

  return <>{children}</>;
}

// Login and logout button components
interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options?: LoginOptions;
}

export function LoginButton({ 
  options, 
  children = 'Log In',
  ...props 
}: LoginButtonProps) {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(options);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options?: LogoutOptions;
}

export function LogoutButton({ 
  options, 
  children = 'Log Out', 
  ...props 
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(options);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} disabled={isLoading} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

// Export everything
export {
  AuthContext,
};