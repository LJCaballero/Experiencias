import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useContext, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Slider from "react-slick";
import { getExperiences } from "../api";

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // Usamos la función modular para obtener experiencias
    getExperiences()
      .then((data) => setExperiences(data))
      .catch(() => setExperiences([]));
  }, []);

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

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
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img
            src="/avatar.png"
            alt="Perfil"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </Link>
        <button
          onClick={toggleTheme}
          style={{
            fontSize: "1.2em",
            marginLeft: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Cambiar modo oscuro"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>

      <header className="hero">
        <div className="hero-text">
          <h1>Vive Experiencias Únicas</h1>
          <p>Descubre aventuras inolvidables cerca de ti.</p>
          <Link to="/experiences" className="cta-button">
            Explorar ahora
          </Link>
        </div>
      </header>

      <section id="experiencias" className="experiences">
        <h2>Experiencias más solicitadas</h2>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {experiences.length > 0 ? (
            <Slider {...settings}>
              {experiences.map((exp) => (
                <div key={exp._id || exp.id} className="card">
                  <img
                    src={exp.image || "/default-experience.jpg"}
                    alt={exp.title}
                  />
                  <h3>{exp.title}</h3>
                  <p>{exp.description}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <p>No hay experiencias para mostrar.</p>
          )}
        </div>
      </section>

      <section className="cta-final">
        <h2>¿Listo para tu próxima aventura?</h2>
        <Link to="/experiences" className="cta-button">
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
