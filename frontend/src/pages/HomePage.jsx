
import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <>
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
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
          <div className="card">
            <img src="" alt="Cocina" />
            <h3>Cocina tradicional</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
          </div>
          <div className="card">
            <img src="" alt="Kayak" />
            <h3>Kayak al atardecer</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
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
