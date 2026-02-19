import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('bb_session');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) return { success: false, error: 'El email ya está registrado.' };

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password, role: 'user' }])
      .select()
      .single();

    if (error) return { success: false, error: 'Error al crear la cuenta.' };
    return { success: true, user: data };
  };

  const login = async (email, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) return { success: false, error: 'Email o contraseña incorrectos.' };

    const session = { id: data.id, name: data.name, email: data.email, role: data.role };
    setUser(session);
    localStorage.setItem('bb_session', JSON.stringify(session));
    return { success: true, user: session };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bb_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
