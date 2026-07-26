import { useEffect } from 'react';
import axios from 'axios';
import { authApi } from '@/services';
import { useAuthStore } from '@/store';
import { API_URL } from '@/services/api';

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setAuth, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!accessToken) {
      axios
        .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
        .then((res) => {
          const { user, accessToken: newToken } = res.data.data;
          setAuth(user, newToken);
        })
        .catch(() => logout());
    } else {
      authApi
        .getMe()
        .then((res) => setUser(res.data.data.user))
        .catch(() => logout());
    }
  }, [isAuthenticated, accessToken, setAuth, setUser, logout]);

  return <>{children}</>;
}
