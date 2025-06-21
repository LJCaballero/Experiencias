// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // <-- SIN BrowserRouter
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
import ProfilePage from './pages/ProfilePage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ExperienceDetailPage from './pages/ExperienceDetailPage';
import UserReservationsPage from './pages/UserReservationPage.jsx';
import UserPage from './pages/UserPage.jsx';

function App() {
  return (

    <>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Inicio</Link>
        <Link to="/login" style={{ marginRight: '15px' }}>Iniciar Sesión</Link>
        <Link to="/register" style={{ marginRight: '15px' }}>Registrarse</Link>
        <Link to="/rating-demo" style={{ marginRight: '15px' }}>Demo Rating</Link>
        <Link to="/experiences" style={{ marginRight: '15px' }}>Experiencias</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/validate/:token" element={<ValidateUserPage />} />
        <Route path="/rating-demo" element={<RatingDemoPage />} />
        <Route path="/experiences" element={<ExperiencesListPage />} />
        <Route path="/admin/experiences/new" element={<ExperienceFormPage />} />
        <Route path="/admin/experiences/:id/edit" element={<ExperienceFormPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
        <Route path="/my-reservations" element={<UserReservationsPage />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}