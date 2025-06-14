// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importa tus páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecoverPassword from './pages/RecoverPassword.jsx';
import ValidateUserPage from './pages/ValidateUserPage.jsx';
import RatingDemoPage from './pages/RatingDemoPage.jsx';
import ExperiencesListPage from './pages/ExperienceListPage.jsx';
import ExperienceFormPage from './pages/ExperienceFormPage.jsx';

// import ExperienceDetailPage from './pages/ExperienceDetailPage';
// import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    // BrowserRouter es el componente principal que habilita las rutas en tu aplicación
    <BrowserRouter>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        {/* Link crea enlaces de navegación sin recargar la página */}
        <Link to="/" style={{ marginRight: '15px' }}>Inicio</Link>
        <Link to="/login" style={{ marginRight: '15px' }}>Iniciar Sesión</Link>
        <Link to="/register" style={{ marginRight: '15px' }}>Registrarse</Link>
        <Link to="/rating-demo" style={{ marginRight: '15px' }}>Demo Rating</Link>
        <Link to="/experiences" style={{ marginRight: '15px' }}>Experiencias</Link>


        {/* Puedes añadir más enlaces aquí, por ejemplo: */}
        {/* <Link to="/experiencias" style={{ marginRight: '15px' }}>Experiencias</Link> */}
      </nav>

      {/* Routes posibles rutas */}
      <Routes>
        {/* Route asocia una URL (path) con un componente (element) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/validate/:token" element={<ValidateUserPage />} />
        <Route path="/rating-demo" element={<RatingDemoPage />} />
        <Route path="/experiences" element={<ExperiencesListPage />} />
        <Route path="/admin/experiences/new" element={<ExperienceFormPage />} />
        <Route path="/admin/experiences/:id/edit" element={<ExperienceFormPage />} /> 

        {/* Ejemplo de una ruta con un parámetro (para una experiencia específica) */}
        {/* <Route path="/experiences/:id" element={<ExperienceDetailPage />} /> */}

        {/* Ruta para "Not Found" (cualquier URL que no coincida con las anteriores) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}