
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ExperienceFormPage.css';

const ExperienceFormPage = () => {
  const { user, isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Para edición
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locality: '',
    experienceDate: '',
    price: '',
    minCapacity: 1,
    totalCapacity: '',
    active: true,
    confirmed: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar ADMIN
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    // Si es edición, cargar datos existentes
    if (isEdit) {
      loadExperienceData();
    }
  }, [user, isAdmin, id, navigate]);

  const loadExperienceData = async () => {
    try {
      console.log('🔍 Cargando experiencia ID:', id);
      const response = await axios.get(`http://localhost:3001/experiences/${id}`);
      console.log('✅ Datos recibidos:', response.data);
      
      const experience = response.data;
      
      // Formatear fecha para el input datetime-local
      const formattedDate = new Date(experience.experienceDate)
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: experience.title,
        description: experience.description,
        locality: experience.locality,
        experienceDate: formattedDate,
        price: experience.price,
        minCapacity: experience.minCapacity,
        totalCapacity: experience.totalCapacity,
        active: experience.active !== undefined ? experience.active : true,
        confirmed: experience.confirmed !== undefined ? experience.confirmed : false,
      });
    } catch (error) {
      console.error(' Error detallado:', error.response?.data || error.message);
      setErrors({ general: 'Error al cargar los datos de la experiencia' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.locality.trim()) {
      newErrors.locality = 'La localidad es obligatoria';
    }
    
    if (!formData.experienceDate) {
      newErrors.experienceDate = 'La fecha de la experiencia es obligatoria';
    } else {
      const selectedDate = new Date(formData.experienceDate);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.experienceDate = 'La fecha debe ser futura';
      }
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor que 0';
    }
    
    if (!formData.totalCapacity || formData.totalCapacity <= 0) {
      newErrors.totalCapacity = 'La capacidad total debe ser mayor que 0';
    }
    
    if (formData.minCapacity > formData.totalCapacity) {
      newErrors.minCapacity = 'La capacidad mínima no puede ser mayor que la total';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        const dataToSend = {
          title: formData.title,
          description: formData.description,
          locality: formData.locality,
          experienceDate: formData.experienceDate,
          price: parseFloat(formData.price),
          minCapacity: parseInt(formData.minCapacity),
          totalCapacity: parseInt(formData.totalCapacity),
          active: formData.active,
          confirmed: formData.confirmed,
        };

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        if (isEdit) {
          // Para editar: solo actualizar estado usando endpoint que existe
          const statusData = {
            active: formData.active,
            confirmed: formData.confirmed
          };
          
          await axios.patch(
            `http://localhost:3001/experiences/${id}/status`, 
            statusData, 
            config
          );
        } else {
          // Para crear: experiencia completa
          await axios.post(
            'http://localhost:3001/experiences', 
            dataToSend, 
            config
          );
        }

        setSuccessMessage(
          isEdit 
            ? 'Experiencia actualizada exitosamente' 
            : 'Experiencia creada exitosamente'
        );
        
        // Limpiar formulario si es creación
        if (!isEdit) {
          setFormData({
            title: '',
            description: '',
            locality: '',
            experienceDate: '',
            price: '',
            minCapacity: 1,
            totalCapacity: '',
            active: true,
            confirmed: false,
          });
        }

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/experiences');
        }, 2000);

      } catch (error) {
        console.error('Error al guardar experiencia:', error);
        setErrors({ 
          general: error.response?.data?.message || 'Error al guardar la experiencia' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Verificación de acceso
  if (!user || !isAdmin) {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{isEdit ? 'Editar Estado de Experiencia' : 'Crear Nueva Experiencia'}</h2>
        <button 
          onClick={() => navigate('/experiences')}
          className="btn-back"
        >
          ← Volver al listado
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="experience-form">
        
        {isEdit ? (
          // MODO EDICIÓN: Solo mostrar información y estado
          <>
            <div className="experience-info">
              <h3 className="info-title">Información de la experiencia:</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Título:</strong> {formData.title}
                </div>
                <div className="info-item">
                  <strong>Localidad:</strong> {formData.locality}
                </div>
                <div className="info-item">
                  <strong>Precio:</strong> {formData.price}€
                </div>
                <div className="info-item">
                  <strong>Capacidad:</strong> {formData.minCapacity} - {formData.totalCapacity} personas
                </div>
              </div>
            </div>

            {/* Estado de la experiencia - SOLO en modo edición */}
            <div className="status-group">
              <div className="form-group">
                <label className="form-label">Cambiar Estado de la Experiencia</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      <strong>Activa</strong> - Visible para usuarios en el listado
                    </span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="confirmed"
                      checked={formData.confirmed}
                      onChange={(e) => setFormData({...formData, confirmed: e.target.checked})}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      <strong>Confirmada</strong> - Preparada para recibir reservas
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : (
          // MODO CREACIÓN: Formulario completo
          <>
            {/* Título */}
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Ej: Senderismo en los Picos de Europa"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe la experiencia en detalle..."
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {/* Localidad */}
            <div className="form-group">
              <label className="form-label">Localidad *</label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className={`form-input ${errors.locality ? 'error' : ''}`}
                placeholder="Ej: Potes, Cantabria"
              />
              {errors.locality && <span className="error-text">{errors.locality}</span>}
            </div>

            {/* Fecha de la experiencia */}
            <div className="form-group">
              <label className="form-label">Fecha y Hora de la Experiencia *</label>
              <input
                type="datetime-local"
                name="experienceDate"
                value={formData.experienceDate}
                onChange={handleChange}
                className={`form-input ${errors.experienceDate ? 'error' : ''}`}
              />
              {errors.experienceDate && <span className="error-text">{errors.experienceDate}</span>}
            </div>

            {/* Precio */}
            <div className="form-group">
              <label className="form-label">Precio (€) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="Ej: 45.99"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            {/* Capacidades */}
            <div className="capacity-group">
              <div className="form-group">
                <label className="form-label">Capacidad Mínima</label>
                <input
                  type="number"
                  name="minCapacity"
                  value={formData.minCapacity}
                  onChange={handleChange}
                  min="1"
                  className={`form-input ${errors.minCapacity ? 'error' : ''}`}
                />
                {errors.minCapacity && <span className="error-text">{errors.minCapacity}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Capacidad Total *</label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  onChange={handleChange}
                  min="1"
                  className={`form-input ${errors.totalCapacity ? 'error' : ''}`}
                />
                {errors.totalCapacity && <span className="error-text">{errors.totalCapacity}</span>}
              </div>
            </div>

            {/* Estado inicial para experiencias nuevas */}
            <div className="status-group">
              <div className="form-group">
                <label className="form-label">Estado Inicial</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Activar experiencia al crearla</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="confirmed"
                      checked={formData.confirmed}
                      onChange={(e) => setFormData({...formData, confirmed: e.target.checked})}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Marcar como confirmada</span>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Botones */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar Estado' : 'Crear Experiencia')}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/experiences')}
            className="btn-cancel"
          >
            Cancelar
          </button>
        </div>

        {/* Mensajes */}
        {errors.general && (
          <div className="message error-message">
            {errors.general}
          </div>
        )}
        
        {successMessage && (
          <div className="message success-message">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default ExperienceFormPage;