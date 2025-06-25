import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/users/reset-password', {
        resetToken: token,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al resetear la contraseña');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '80px' }}>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Token de recuperación:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <label>Nueva contraseña:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Cambiar contraseña
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;