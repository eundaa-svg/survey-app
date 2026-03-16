import { useSession } from 'next-auth/react';
import { User } from '@/types';

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user as User | undefined,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
};
