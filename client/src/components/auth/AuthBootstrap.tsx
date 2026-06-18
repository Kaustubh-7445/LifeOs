import { useEffect } from 'react';
import { authApi } from '@/services';
import { useAuthStore } from '@/store';

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    authApi.getMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => logout());
  }, [isAuthenticated, accessToken, setUser, logout]);

  return <>{children}</>;
}
