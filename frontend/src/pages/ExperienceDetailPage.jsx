import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import { useAuth } from '../context/AuthContext';
import './ExperienceDetailPage.css';

const ExperienceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [reservationLoading, setReservationLoading] = useState(false);

  useEffect(() => {
    loadExperience();
    if (isAuthenticated) {
      loadUserReservations();
    }
  }, [id, isAuthenticated]);

  const loadExperience = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/experiences/${id}`);
      
      // Simular ratings (en producción vendrían del backend)
      const experienceWithRating = {
        ...response.data,
        averageRating: Math.floor(Math.random() * 5) + 1,
        totalRatings: Math.floor(Math.random() * 50) + 1,
        availablePlaces: response.data.totalCapacity - Math.floor(Math.random() * response.data.totalCapacity * 0.7)
      };
      
      setExperience(experienceWithRating);
    } catch (error) {
      console.error('Error al cargar experiencia:', error);
      setError('Error al cargar la experiencia');
    } finally {
      setLoading(false);
    }
  };

  const loadUserReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/reservas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data.data.reservations || []);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    }
  };

  const hasReservation = () => {
    return reservations.some(reservation => 
      reservation.experience_id === parseInt(id) && 
      ['pending', 'confirmed'].includes(reservation.reservation_status)
    );
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (hasReservation()) {
      alert('Ya tienes una reserva activa para esta experiencia');
      return;
    }

    setReservationLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const reservationData = {
        experienceId: parseInt(id),
        userId: user.id,
        experienceDate: experience.experienceDate,
        numberOfPeople: parseInt(numberOfPeople)
      };

      await axios.post('http://localhost:3001/reservas', reservationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('¡Reserva realizada con éxito!');
      setShowReservationForm(false);
      loadUserReservations();
      loadExperience(); // Recargar para actualizar plazas disponibles
      
    } catch (error) {
      console.error('Error al hacer reserva:', error);
      alert(error.response?.data?.message || 'Error al realizar la reserva');
    } finally {
      setReservationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const isExperienceInPast = () => {
    return new Date(experience.experienceDate) < new Date();
  };

  const canMakeReservation = () => {
    return isAuthenticated && 
           !hasReservation() && 
           !isExperienceInPast() && 
           experience.availablePlaces > 0 &&
           !isAdmin;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando experiencia...</p>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="error-container">
        <p>{error || 'Experiencia no encontrada'}</p>
        <Link to="/experiences" className="btn-back">
          ← Volver a experiencias
        </Link>
      </div>
    );
  }

  return (
    <div className="experience-detail-container">
      {/* Header con navegación */}
      <div className="detail-header">
        <Link to="/experiences" className="btn-back">
          ← Volver a experiencias
        </Link>
        
        {isAdmin && (
          <Link to={`/admin/experiences/${id}/edit`} className="btn-edit">
            Editar experiencia
          </Link>
        )}
      </div>

      {/* Imagen principal */}
      <div className="experience-hero">
        {experience.image ? (
          <img src={experience.image} alt={experience.title} className="hero-image" />
        ) : (
          <div className="hero-placeholder">
            <span>📸</span>
            <p>Sin imagen disponible</p>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="experience-content">
        <div className="content-main">
          {/* Información básica */}
          <div className="experience-header">
            <h1>{experience.title}</h1>
            
            <div className="experience-meta">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{experience.locality}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">🗓️</span>
                <span>{formatDate(experience.experienceDate)}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">👥</span>
                <span>
                  {experience.minCapacity} - {experience.totalCapacity} personas
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="experience-rating">
              <Rating 
                initialRating={experience.averageRating}
                readOnly={true}
                size="medium"
              />
              <span className="rating-text">
                {experience.averageRating}/5 ({experience.totalRatings} valoraciones)
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="experience-description">
            <h2>Descripción</h2>
            <p>{experience.description}</p>
          </div>

          {/* Información adicional */}
          <div className="experience-info">
            <h2>Información adicional</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Precio por persona:</strong>
                <span className="price-highlight">{formatPrice(experience.price)}</span>
              </div>
              
              <div className="info-item">
                <strong>Plazas disponibles:</strong>
                <span className={experience.availablePlaces > 0 ? 'available' : 'unavailable'}>
                  {experience.availablePlaces} de {experience.totalCapacity}
                </span>
              </div>
              
              <div className="info-item">
                <strong>Estado:</strong>
                <span className={experience.active ? 'status-active' : 'status-inactive'}>
                  {experience.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar con acciones */}
        <div className="content-sidebar">
          <div className="reservation-card">
            <div className="price-display">
              {formatPrice(experience.price)}
              <span className="price-per-person">por persona</span>
            </div>

            {/* Estado de la reserva */}
            {hasReservation() && (
              <div className="reservation-status">
                <p className="status-message">
                  ✅ Ya tienes una reserva para esta experiencia
                </p>
                <Link to="/my-reservations" className="btn-view-reservations">
                  Ver mis reservas
                </Link>
              </div>
            )}

            {/* Formulario de reserva */}
            {!showReservationForm && canMakeReservation() && (
              <button 
                className="btn-reserve"
                onClick={() => setShowReservationForm(true)}
              >
                Reservar ahora
              </button>
            )}

            {showReservationForm && canMakeReservation() && (
              <form onSubmit={handleReservation} className="reservation-form">
                <div className="form-group">
                  <label htmlFor="numberOfPeople">Número de personas:</label>
                  <select
                    id="numberOfPeople"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    min={experience.minCapacity}
                    max={Math.min(experience.availablePlaces, experience.totalCapacity)}
                    required
                  >
                    {Array.from(
                      { length: Math.min(experience.availablePlaces, experience.totalCapacity) }, 
                      (_, i) => i + 1
                    ).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="total-price">
                  <strong>
                    Total: {formatPrice(experience.price * numberOfPeople)}
                  </strong>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-confirm-reservation"
                    disabled={reservationLoading}
                  >
                    {reservationLoading ? 'Procesando...' : 'Confirmar reserva'}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowReservationForm(false)}
                    disabled={reservationLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Mensajes de estado */}
            {!isAuthenticated && (
              <div className="auth-message">
                <p>Para reservar necesitas iniciar sesión</p>
                <Link to="/login" className="btn-login">
                  Iniciar sesión
                </Link>
              </div>
            )}

            {isExperienceInPast() && (
              <div className="past-experience">
                <p>Esta experiencia ya ha pasado</p>
              </div>
            )}

            {experience.availablePlaces === 0 && !isExperienceInPast() && (
              <div className="no-availability">
                <p>Sin plazas disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailPage;