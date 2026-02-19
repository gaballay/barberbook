import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✂</span>
          <span className="brand-text">BarberBook</span>
        </Link>

        <nav className="navbar-nav">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Ingresar</Link>
              <Link to="/register" className="btn-primary" style={{padding:'9px 22px', borderRadius:'8px', fontSize:'14px'}}>Registrarse</Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                Hola, <strong>{user.name}</strong>
                {user.role === 'admin' && <span className="badge badge-gold" style={{marginLeft:'8px'}}>Admin</span>}
              </span>
              {user.role === 'admin' ? (
                <Link to="/admin" className="nav-link">Panel Admin</Link>
              ) : (
                <Link to="/reservar" className="nav-link">Mis Turnos</Link>
              )}
              <button className="btn-ghost" onClick={handleLogout}>Salir</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
