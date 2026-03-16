'use client';

import { useEffect, useState } from 'react';

export interface User {
  id: string;
  nickname: string;
  department: string;
  grade: number;
  points: number;
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setAuthState({
              isLoggedIn: true,
              user: data.user,
              isLoading: false,
            });
          } else {
            setAuthState({
              isLoggedIn: false,
              user: null,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            isLoggedIn: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}
