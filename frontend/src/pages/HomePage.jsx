import React, { useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import UserPage from "./UserPage";

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  const togglePerfil = () => {
    setMostrarPerfil(!mostrarPerfil);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">Experiencias</div>
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/login"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Registro
          </Link>
          <Link
            to="/experiences"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Todas las experiencias
          </Link>
        </div>
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </div>
        <button
          className="mini-avatar"
          onClick={togglePerfil}
          aria-label="Abrir perfil"
        >
          <img
            src="/avatar.png"
            alt="Perfil"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </button>
      </nav>

      <header className="hero">
        <div className="hero-text">
          <h1>Vive Experiencias Únicas</h1>
          <p>Descubre aventuras inolvidables cerca de ti.</p>
          <Link to="/experiencias" className="cta-button">
            Explorar ahora
          </Link>
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
        <Link to="/experiencias" className="cta-button">
          Empezar ahora
        </Link>
      </section>

      <footer>
        <p>&copy; 2025 Experiencias Únicas</p>
      </footer>

      {mostrarPerfil && <UserPage onCerrar={togglePerfil} />}
    </>
  );
}

export default HomePage;
