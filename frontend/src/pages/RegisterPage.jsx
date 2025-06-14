// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        if (formData.avatar) {
          formDataToSend.append('avatar', formData.avatar);
        }

        const response = await fetch('http://localhost:3001/users/register', {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage('Registro exitoso');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            avatar: null,
          });
        } else {
          setErrors({ general: data.error || 'Error en el registro' });
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Error en registro:', error);
        setErrors({ 
        general: error.response?.data?.message || 'Error de conexión con el servidor' 
        });
        setSuccessMessage('');
      }
    } else {
      setSuccessMessage('');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Registro de nuevo usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}

        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Registrarse</button>
      </form>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
};

export default RegisterPage;