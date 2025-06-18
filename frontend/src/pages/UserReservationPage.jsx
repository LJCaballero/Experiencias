import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import { useAuth } from '../context/AuthContext';
import './UserReservationPage.css';

const UserReservationsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingReservation, setCancellingReservation] = useState(null);

  // Estados para valoración
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadReservations();
  }, [isAuthenticated, navigate]);

  const loadReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/reservas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReservations(response.data.data.reservations || []);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    setCancellingReservation(reservationId);
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/reservas/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Reserva cancelada exitosamente');
      loadReservations(); // Recargar la lista
      
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert(error.response?.data?.message || 'Error al cancelar la reserva');
    } finally {
      setCancellingReservation(null);
    }
  };

  const handleRatingClick = (reservation) => {
    setSelectedReservation(reservation);
    setRating(reservation.rating || 0);
    setComment(reservation.comment || '');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Por favor, selecciona una puntuación');
      return;
    }

    setSubmittingRating(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3001/valoraciones`, {
        reservationId: selectedReservation.reservation_id,
        rating: rating,
        comment: comment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('¡Valoración enviada exitosamente!');
      setShowRatingModal(false);
      setSelectedReservation(null);
      loadReservations(); // Recargar para mostrar la nueva valoración
      
    } catch (error) {
      console.error('Error al enviar valoración:', error);
      alert(error.response?.data?.message || 'Error al enviar la valoración');
    } finally {
      setSubmittingRating(false);
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Pendiente', class: 'status-pending' },
      confirmed: { text: 'Confirmada', class: 'status-confirmed' },
      cancelled: { text: 'Cancelada', class: 'status-cancelled' },
      completed: { text: 'Completada', class: 'status-completed' }
    };

    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const canCancelReservation = (reservation) => {
    const experienceDate = new Date(reservation.experience_date);
    const now = new Date();
    const hoursUntilExperience = (experienceDate - now) / (1000 * 60 * 60);
    
    return ['pending', 'confirmed'].includes(reservation.reservation_status) && 
           hoursUntilExperience > 24;
  };

  const canRateExperience = (reservation) => {
    return reservation.reservation_status === 'completed' && !reservation.rating;
  };

  const hasBeenRated = (reservation) => {
    return reservation.rating && reservation.rating > 0;
  };

  const isExperienceInPast = (reservation) => {
    return new Date(reservation.experience_date) < new Date();
  };



  // Agrupar reservas por estado
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const status = reservation.reservation_status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(reservation);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando tus reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/experiences" className="btn-back">
          ← Volver a experiencias
        </Link>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      {/* Header */}
      <div className="reservations-header">
        <div className="header-content">
          <h1>Mis Reservas</h1>
          <p>Gestiona todas tus reservas de experiencias</p>
        </div>
        <Link to="/experiences" className="btn-back">
          ← Volver a experiencias
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="reservations-stats">
        <div className="stat-card">
          <h3>{reservations.length}</h3>
          <p>Total de reservas</p>
        </div>
        <div className="stat-card">
          <h3>{groupedReservations.confirmed?.length || 0}</h3>
          <p>Confirmadas</p>
        </div>
        <div className="stat-card">
          <h3>{groupedReservations.completed?.length || 0}</h3>
          <p>Completadas</p>
        </div>
        <div className="stat-card">
          <h3>{reservations.filter(r => canRateExperience(r)).length}</h3>
          <p>Por valorar</p>
        </div>
      </div>

      {/* Lista de reservas */}
      {reservations.length === 0 ? (
        <div className="no-reservations">
          <div className="no-reservations-content">
            <h2>No tienes reservas aún</h2>
            <p>¡Explora nuestras experiencias y haz tu primera reserva!</p>
            <Link to="/experiences" className="btn-explore">
              Explorar experiencias
            </Link>
          </div>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations
            .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate))
            .map(reservation => (
            <div key={reservation.reservation_id} className="reservation-card">
              
              {/* Imagen de la experiencia */}
              <div className="reservation-image">
                {reservation.experience_image ? (
                  <img 
                    src={reservation.experience_image} 
                    alt={reservation.experience_title} 
                  />
                ) : (
                  <div className="image-placeholder">
                    📸
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="reservation-content">
                <div className="reservation-header">
                  <h3 className="experience-title">
                    <Link to={`/experiences/${reservation.experience_id}`}>
                      {reservation.experience_title}
                    </Link>
                  </h3>
                  {getStatusBadge(reservation.reservation_status)}
                </div>

                <div className="reservation-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{reservation.experience_locality}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🗓️</span>
                    <span>{formatDate(reservation.experience_date)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{reservation.numberOfPeople} {reservation.numberOfPeople === 1 ? 'persona' : 'personas'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>{formatPrice(reservation.experience_price * reservation.numberOfPeople)}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>Reservado el {formatDate(reservation.reservationDate)}</span>
                  </div>
                </div>

                {/* Descripción de la experiencia */}
                <p className="experience-description">
                  {reservation.experience_description.length > 120 
                    ? `${reservation.experience_description.substring(0, 120)}...`
                    : reservation.experience_description
                  }
                </p>

                {/* Indicador de experiencia pasada */}
                {isExperienceInPast(reservation) && reservation.reservation_status !== 'completed' && reservation.reservation_status !== 'cancelled' && (
                  <div className="past-experience-notice">
                    ⏰ Esta experiencia ya ha finalizado
                  </div>
                )}

                {/* Valoración si existe */}
                {hasBeenRated(reservation) && (
                  <div className="existing-rating">
                    <h4>Tu valoración:</h4>
                    <div className="rating-display">
                      <Rating 
                        initialRating={reservation.rating}
                        readOnly={true}
                        size="small"
                      />
                      <span className="rating-date">
                        {formatDate(reservation.ratingDate)}
                      </span>
                    </div>
                    {reservation.comment && (
                      <p className="rating-comment">"{reservation.comment}"</p>
                    )}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="reservation-actions">
                <Link 
                  to={`/experiences/${reservation.experience_id}`}
                  className="btn-view-experience"
                >
                  Ver experiencia
                </Link>

                {canCancelReservation(reservation) && (
                  <button
                    className="btn-cancel-reservation"
                    onClick={() => handleCancelReservation(reservation.reservation_id)}
                    disabled={cancellingReservation === reservation.reservation_id}
                  >
                    {cancellingReservation === reservation.reservation_id 
                      ? 'Cancelando...' 
                      : 'Cancelar reserva'
                    }
                  </button>
                )}

                {canRateExperience(reservation) && (
                  <button
                    className="btn-rate-experience"
                    onClick={() => handleRatingClick(reservation)}
                  >
                    Valorar experiencia
                  </button>
                )}

                {hasBeenRated(reservation) && (
                  <button
                    className="btn-edit-rating"
                    onClick={() => handleRatingClick(reservation)}
                  >
                    Editar valoración
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de valoración */}
      {showRatingModal && selectedReservation && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Valorar: {selectedReservation.experience_title}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRatingModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleRatingSubmit} className="rating-form">
                <div className="form-group">
                  <label>Puntuación:</label>
                  <div className="rating-input">
                    <Rating 
                      initialRating={rating}
                      onRatingChange={setRating}
                      readOnly={false}
                      size="large"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Comentario (opcional):</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos tu experiencia..."
                    rows={4}
                    maxLength={500}
                  />
                  <small>{comment.length}/500 caracteres</small>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-submit-rating"
                    disabled={submittingRating || rating === 0}
                  >
                    {submittingRating ? 'Enviando...' : 'Enviar valoración'}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowRatingModal(false)}
                    disabled={submittingRating}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReservationsPage;