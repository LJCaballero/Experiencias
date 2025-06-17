import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/users/reset-password', { resetToken, newPassword });
      setSuccess('¡Contraseña cambiada correctamente! Ya puedes iniciar sesión.');
      setResetToken('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Token de recuperación:</label>
          <input
            type="text"
            value={resetToken}
            onChange={e => setResetToken(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nueva contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;