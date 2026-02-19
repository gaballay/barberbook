import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-ornament">✦ EST. 2024 ✦</div>
        <h1 className="hero-title">
          El estilo que<br />
          <em>merecés.</em>
        </h1>
        <p className="hero-sub">
          Reservá tu turno en segundos. Sin esperas. Sin llamadas.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : '/reservar'}
              className="btn-primary hero-btn"
            >
              {user.role === 'admin' ? 'Ir al Panel Admin' : 'Reservar Turno'}
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary hero-btn">Crear cuenta gratis</Link>
              <Link to="/login" className="btn-outline hero-btn">Ya tengo cuenta</Link>
            </>
          )}
        </div>
      </div>

      <div className="home-services page-wrapper">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="services-grid">
          {[
            { icon: '✂️', name: 'Corte de Cabello', desc: 'Clásico o moderno, siempre impecable.', price: '$2.500' },
            { icon: '🧔', name: 'Arreglo de Barba', desc: 'Perfilado y definición profesional.', price: '$1.800' },
            { icon: '⭐', name: 'Corte + Barba', desc: 'El combo completo para lucir bien.', price: '$3.800' },
            { icon: '👁️', name: 'Perfilado de Cejas', desc: 'Detalle que marca la diferencia.', price: '$800' },
          ].map(s => (
            <div key={s.name} className="service-card">
              <span className="service-icon">{s.icon}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <span className="service-price">{s.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-info page-wrapper">
        <div className="info-card card">
          <div className="info-item">
            <span className="info-icon">🕐</span>
            <div>
              <strong>Horarios</strong>
              <span>Lun – Sáb: 9:00 a 19:00</span>
            </div>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <strong>Ubicación</strong>
              <span>Av. Corrientes 1234, CABA</span>
            </div>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <strong>Teléfono</strong>
              <span>+54 11 1234-5678</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
