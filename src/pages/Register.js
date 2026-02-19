import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden.');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    if (!result.success) { setLoading(false); return setError(result.error); }
    await login(form.email, form.password);
    setLoading(false);
    navigate('/reservar');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <span style={{fontSize:'32px',color:'var(--gold)'}}>✂</span>
          <h1>Crear cuenta</h1>
          <p>Registrate y reservá tu turno hoy</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              placeholder="Juan García"
              value={form.name}
              onChange={handle}
              required
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              placeholder="Repetí la contraseña"
              value={form.confirm}
              onChange={handle}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'14px'}}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
        </div>
      </div>
    </div>
  );
}
