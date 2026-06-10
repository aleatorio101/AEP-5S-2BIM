import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, usuarioService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('edualerta_token');
    if (!token) { setLoading(false); return; }
    usuarioService.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('edualerta_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await authService.login(email, senha);
    localStorage.setItem('edualerta_token', data.token);
    const me = await usuarioService.me();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edualerta_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}