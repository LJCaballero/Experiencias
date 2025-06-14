
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import { useAuth } from '../context/AuthContext';
import './ExperienceListPage.css';

const ExperiencesListPage = () => {
  const { user, isAdmin } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    locality: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  

  const loadExperiences = async () => {
    try {
      const response = await axios.get('http://localhost:3001/experiences');
      
      // Simular ratings (en producción vendrían del backend)
      const experiencesWithRatings = response.data.map(exp => ({
        ...exp,
        averageRating: Math.floor(Math.random() * 5) + 1,
        totalRatings: Math.floor(Math.random() * 50) + 1
      }));
      
      setExperiences(experiencesWithRatings);
    } catch (error) {
      console.error('Error al cargar experiencias:', error);
      setError('Error al cargar las experiencias');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
  let filtered = [...experiences];
  
  // Filtro por búsqueda de texto
  if (filters.search) {
    filtered = filtered.filter(exp =>
      exp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      exp.description.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  // Filtro por localidad
  if (filters.locality) {
    filtered = filtered.filter(exp =>
      exp.locality.toLowerCase().includes(filters.locality.toLowerCase())
    );
  }

  // Filtro por precio
  if (filters.minPrice) {
    filtered = filtered.filter(exp => exp.price >= parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(exp => exp.price <= parseFloat(filters.maxPrice));
  }

  // Ordenación
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
      default:
        comparison = new Date(a.experienceDate) - new Date(b.experienceDate);
        break;
    }

    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  setFilteredExperiences(filtered);
}, [experiences, filters]);

useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [experiences, filters, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando experiencias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="experiences-container">
      
      {/* Header */}
      <div className="experiences-header">
        <div className="header-content">
            <h2>Experiencias Disponibles</h2>
            {user && <p className="welcome-text">Bienvenido, {user.firstName}</p>}
        </div>
        {isAdmin && (
            <Link to="/admin/experiences/new" className="btn-new-experience">
            + Nueva Experiencia
            </Link>
        )}
    </div>

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Buscar</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Título o descripción..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Localidad</label>
          <input
            type="text"
            name="locality"
            value={filters.locality}
            onChange={handleFilterChange}
            placeholder="Ciudad o región..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Precio Mín. (€)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            min="0"
            step="0.01"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Precio Máx. (€)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            min="0"
            step="0.01"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Ordenar por</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="date">Fecha</option>
            <option value="price">Precio</option>
            <option value="title">Título</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Orden</label>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="results-info">
        <p>
          Mostrando {filteredExperiences.length} de {experiences.length} experiencias
        </p>
      </div>

      {/* Lista de experiencias */}
      <div className="experiences-list">
        {filteredExperiences.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron experiencias que coincidan con los filtros.</p>
          </div>
        ) : (
          filteredExperiences.map(experience => (
            <div key={experience.id} className="experience-card">
              
              {/* Imagen */}
              <div className="experience-image">
                {experience.image ? (
                  <img src={experience.image} alt={experience.title} />
                ) : (
                  <span className="image-placeholder">📸</span>
                )}
              </div>

              {/* Contenido principal */}
              <div className="experience-content">
                <h3 className="experience-title">{experience.title}</h3>
                
                <p className="experience-location">
                  📍 {experience.locality}
                </p>
                
                <p className="experience-description">
                  {experience.description.length > 150 
                    ? `${experience.description.substring(0, 150)}...`
                    : experience.description
                  }
                </p>

                <div className="experience-rating">
                  <Rating 
                    initialRating={experience.averageRating}
                    readOnly={true}
                    size="small"
                  />
                  <span className="rating-count">
                    ({experience.totalRatings} valoraciones)
                  </span>
                </div>

                <p className="experience-date">
                  🗓️ {formatDate(experience.experienceDate)}
                </p>
                
                <p className="experience-capacity">
                  👥 Capacidad: {experience.minCapacity} - {experience.totalCapacity} personas
                </p>
              </div>

              {/* Precio y acciones */}
              <div className="experience-actions">
                <div className="experience-price">
                  {formatPrice(experience.price)}
                </div>
                
                <div className="action-buttons">
                  <button
                    className="btn-details"
                    onClick={() => alert('Ver detalles de: ' + experience.title)}
                  >
                    Ver Detalles
                  </button>
                  
                  {isAdmin && (
                    <Link
                      to={`/admin/experiences/${experience.id}/edit`}
                      className="btn-edit"
                    >
                      Editar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperiencesListPage;