// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // <-- Corregido: ./ no ../
import Navbar from "./components/Navbar";

// Importa tus páginas
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoverPassword from "./pages/RecoverPassword.jsx";
import ValidateUserPage from "./pages/ValidateUserPage.jsx";
import RatingDemoPage from "./pages/RatingDemoPage.jsx";
import ExperiencesListPage from "./pages/ExperienceListPage.jsx";
import ExperienceFormPage from "./pages/ExperienceFormPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import UserReservationsPage from "./pages/UserReservationPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import MyRatingsPage from "./pages/MyRatingsPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/validate/:token" element={<ValidateUserPage />} />
        <Route path="/rating-demo" element={<RatingDemoPage />} />
        <Route path="/experiences" element={<ExperiencesListPage />} />
        <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
        <Route path="/admin/experiences/new" element={<ExperienceFormPage />} />
        <Route
          path="/admin/experiences/:id/edit"
          element={<ExperienceFormPage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/my-reservations" element={<UserReservationsPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/my-ratings" element={<MyRatingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
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
