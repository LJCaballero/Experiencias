// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [LoginLoading, setLoginLoading] = useState(false);

  //Jose --> Si ya está logueado, redirigir automáticamente
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log(' Usuario ya logueado, redirigiendo...');
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);
    try {

      console.log('Intentando login con:', email);

      const response = await axios.post('http://localhost:3001/users/login', { email, password });

      const { token, user } = response.data;

      console.log('Login exitoso...', user);


      login(token, user);

     // Redirigirimos según el rol

      if (user.role === 'admin') {
        navigate('/admin/experiences');
      } else {
        navigate('/experiences');
      }
      
    } catch (error) {
      console.error(' Error en login:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');

    } finally {
      setLoginLoading(false);
    }
  };

   // Visual mientras  se carga el  pinche contexto
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="tu@email.com"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Tu contraseña"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={LoginLoading}
          className="login-button"
        >
          {LoginLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="login-links">
        <p>
          ¿No tienes una cuenta?{' '}
          <Link to="/register">
            Regístrate aquí
          </Link>
        </p>
        <p>
          <Link to="/recover-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

