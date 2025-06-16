
import React, { useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo">Experiencias</div>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-button">Inicio</Link>
          <Link to="/login" className="nav-button">Iniciar sesión</Link>
          <Link to="/register" className="nav-button">Registro</Link>
          <Link to="/experiencias" className="nav-button">Todas las experiencias</Link>
        </div>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </nav>

      <header className="hero">
        <div className="hero-text">
          <h1>Vive Experiencias Únicas</h1>
          <p>Descubre aventuras inolvidables cerca de ti.</p>
          <a href="#experiencias" className="cta-button">Explorar ahora</a>
        </div>
      </header>

      <section id="experiencias" className="experiences">
        <h2>Experiencias Destacadas</h2>
        <div className="cards">
          <div className="card">
            <img src="" alt="Montaña" />
            <h3>Aventura en la montaña</h3>
            <p>Senderismo y naturaleza para recargar energía.</p>
          </div>
          <div className="card">
            <img src="" alt="Cocina" />
            <h3>Cocina tradicional</h3>
            <p>Aprende a cocinar con ingredientes locales.</p>
          </div>
          <div className="card">
            <img src="" alt="Kayak" />
            <h3>Kayak al atardecer</h3>
            <p>Explora la costa desde el agua mientras se pone el sol.</p>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <h2>¿Listo para tu próxima aventura?</h2>
        <a href="#experiencias" className="cta-button">Empezar ahora</a>
      </section>

      <footer>
        <p>&copy; 2025 Experiencias Únicas</p>
      </footer>
    </>
  );
}

export default HomePage;
