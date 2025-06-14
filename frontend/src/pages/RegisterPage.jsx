import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    //avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName.trim())
      newErrors.lastName = "El apellido es obligatorio";
    if (!formData.email.trim())
      newErrors.email = "El correo electrónico es obligatorio";
    if (!formData.password.trim())
      newErrors.password = "La contraseña es obligatoria";
    else if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        
        //JSON
        const dataToSend = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        };
        
        //FORM DATA --> PARA CUANDO MEtamos imagens y cambiemos el backend
        // const formDataToSend = new FormData();
        // formDataToSend.append("firstName", formData.firstName);
        // formDataToSend.append("lastName", formData.lastName);
        // formDataToSend.append("email", formData.email);
        // formDataToSend.append("password", formData.password);
        // if (formData.avatar) {
        //   formDataToSend.append("avatar", formData.avatar);
        // }

        const response = await fetch("http://localhost:3001/users/register", {
          method: "POST",
          //JSON
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(dataToSend),
          //body: formDataToSend,
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage("Registro exitoso");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            avatar: null,
          });
          setErrors({});
        } else {
          setErrors({ general: data.error || "Error en el registro" });
          setSuccessMessage("");
        }
      } catch (error) {
        console.error("Error en registro:", error);
        setErrors({
          general:
            error.response?.data?.message ||
            "Error de conexión con el servidor",
        });
        setSuccessMessage("");
      }
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro de nuevo usuario</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <div className="error-message">{errors.firstName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <div className="error-message">{errors.lastName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-input"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="avatar" className="form-label">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            className="form-input"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <button type="submit" className="register-button">
          Registrarse
        </button>
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default RegisterPage;
