// HE COMENTADO LA RUTA Y DEMAS PARA QUE NO DE ERROR  Y ARREGALARLA CUANDO IMPLEMENTEMOS EL RECUPERAR CONTRASEÑA

import React, { useState } from 'react';
import axios from 'axios';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);
    setResetToken('');
    try {
      const res = await axios.post('http://localhost:3001/users/forgot-password', { email });
      setSubmitted(true);
      setResetToken(res.data.resetToken); // Solo para pruebas
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Recuperar Contraseña</h2>
      {submitted ? (
        <div>
          <p style={{ color: 'green' }}>
            Si el correo está registrado, se ha enviado un enlace de recuperación a tu correo electrónico.
          </p>
          {resetToken && (
            <div>
              <p><b>Token de recuperación (solo para pruebas):</b></p>
              <code>{resetToken}</code>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Cargando...' : 'Recuperar Contraseña'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default RecoverPassword;