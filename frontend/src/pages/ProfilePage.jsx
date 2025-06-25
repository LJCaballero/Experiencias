import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, token, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:3001/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message || "Perfil actualizado correctamente");
      updateUser({ ...user, ...formData });
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  // Handlers para los botones
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMyBookings = () => {
    navigate("/my-reservations");
  };

  const handleMyRatings = () => {
    navigate("/my-ratings");
  };

  // Password handlers
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    try {
      await axios.put(
        "http://localhost:3001/users/change-password",
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordSuccess("Contraseña actualizada correctamente");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Error al cambiar la contraseña"
      );
    }
  };

  return (
    <div className="main-content">
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <h2>Mi Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Sección de contraseña */}
          <div
            style={{
              marginTop: "1.5rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <label style={{ marginRight: "8px" }}>Contraseña:</label>
            <input
              type="password"
              value="********"
              disabled
              style={{ width: "100px", marginRight: "8px" }}
              readOnly
            />
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              style={{
                background: "#0077cc",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Cambiar contraseña
            </button>
          </div>
          {showPasswordForm && (
            <form
              onSubmit={handlePasswordSubmit}
              style={{ marginBottom: "1rem" }}
            >
              <div>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Contraseña actual"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  style={{ marginBottom: "8px", width: "100%" }}
                  required
                />
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Nueva contraseña"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  style={{ marginBottom: "8px", width: "100%" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1em",
                  }}
                  tabIndex={-1}
                  aria-label={
                    showNewPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  style={{ marginBottom: "8px", width: "100%" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1em",
                  }}
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                style={{
                  background: "#ff5a5f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Guardar nueva contraseña
              </button>
              {passwordSuccess && (
                <p style={{ color: "green" }}>{passwordSuccess}</p>
              )}
              {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
            </form>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            Actualizar
          </button>
        </form>
        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Botones adicionales */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <button
            onClick={handleMyBookings}
            style={{
              background: "#0077cc",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Mis reservas hechas
          </button>
          <button
            onClick={handleMyRatings}
            style={{
              background: "#23272f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Mis valoraciones
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "#ff5a5f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
