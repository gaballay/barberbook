import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (!result.success) return setError(result.error);
    navigate(result.user.role === 'admin' ? '/admin' : '/reservar');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <span className="brand-icon" style={{fontSize:'32px',color:'var(--gold)'}}>✂</span>
          <h1>Bienvenido</h1>
          <p>Ingresá a tu cuenta para gestionar tus turnos</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'14px'}}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </div>

        <div className="auth-hint">
          <strong>Demo admin:</strong> admin@barberbook.com / admin123
        </div>
      </div>
    </div>
  );
}
