'use client';

import { createContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const AuthContext = createContext({
  user: null,
  loginAuth: () => {},
  logoutAuth: () => {},
  loading: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  // Safe checks against redirect looping, using only dependency array items
  useEffect(() => {
    if (!loading) {
      if (
        !user &&
        !pathname.startsWith('/login') &&
        !pathname.startsWith('/register')
      ) {
        // Not authenticated and not on public pages
        router.push('/login');
      } else if (
        user &&
        (pathname === '/login' || pathname === '/register' || pathname === '/')
      ) {
        // Authenticated but on login/register/index
        router.push('/products');
      }
    }
  }, [user, loading, pathname, router]);

  const loginAuth = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/products');
  };

  const logoutAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loginAuth, logoutAuth, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
