import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { loadAccessToken, removeClientAccessToken } from '@/api/axios';
import {
  // getAccountInfo,
  useGetAccountInfo,
} from '@/api/resources';
import { AxiosError } from 'axios';

interface AuthContextValues {
  isAuthenticated: boolean;
  isInitialized: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const defaultAuthContext: AuthContextValues = {
  isAuthenticated: false,
  isInitialized: false,
  setIsAuthenticated: () => {},
};

export const AuthContext = createContext<AuthContextValues>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: accountInfo, isError, error } = useGetAccountInfo();

  // Use React Query hook to handle authentication state
  useEffect(() => {
    loadAccessToken(); // Ensure the token is loaded

    if (accountInfo) {
      setIsAuthenticated(true);
      setIsInitialized(true);
    } else if (isError) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Not authenticated');
        setIsAuthenticated(false);
      } else {
        console.error('Failed to fetch account info:', error);
      }
      setIsInitialized(true);
    }
  }, [accountInfo, isError, error]);

  // Legacy initialization for backward compatibility if needed
  // useEffect(() => {
  //   if (!isInitialized && !accountInfo && !isError) {
  //     const initializeAuth = async () => {
  //       try {
  //         const isValid = await getAccountInfo();
  //         if (isValid) {
  //           setIsAuthenticated(true);
  //         }
  //       } catch (error) {
  //         if (error instanceof AxiosError && error.response?.status === 401) {
  //           console.log('Not authenticated');
  //           setIsAuthenticated(false);
  //         } else {
  //           console.error('Failed to fetch account info:', error);
  //         }
  //       } finally {
  //         setIsInitialized(true);
  //       }
  //     };

  //     initializeAuth();
  //   }
  // }, [isInitialized, accountInfo, isError]);

  const value = useMemo(
    () => ({ isAuthenticated, isInitialized, setIsAuthenticated }),
    [isAuthenticated, isInitialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
