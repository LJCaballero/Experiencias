import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await axios.put('http://localhost:3001/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess(response.data.message || 'Perfil actualizado correctamente');
      updateUser({ ...user, ...formData });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content"> {/* <-- Aquí agregas la clase */}
      <div style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>Mi Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <label>Apellido:</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>Actualizar</button>
        </form>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;