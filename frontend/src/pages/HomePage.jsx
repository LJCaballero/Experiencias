import React, { useState, useContext } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();

  return (
    <>
      <nav className={`navbar ${theme}`}>
        <div className="logo">Experiencias</div>
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          {!user && (
            <>
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
            </>
          )}
          <Link
            to="/experiences"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Todas las experiencias
          </Link>
          {user && (
            <button
              className="nav-button"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                font: "inherit",
                cursor: "pointer",
                padding: 0,
                marginLeft: "16px"
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </div>
        <Link
          to="/profile"
          className="mini-avatar"
          aria-label="Ir a perfil"
          style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
        >
          <img
            src="/avatar.png"
            alt="Perfil"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </Link>
        <button
          onClick={toggleTheme}
          style={{ fontSize: "1.2em", marginLeft: "16px", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Cambiar modo oscuro"
        >
          {theme === "light" ? "🌙" : "☀️"}
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
    </>
  );
}

export default HomePage;