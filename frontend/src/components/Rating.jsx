import React, { useState } from 'react';

const Rating = ({ 
  initialRating = 0, 
  maxStars = 5, 
  onRatingChange, 
  readOnly = false,
  size = 'medium' 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (readOnly) return;
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };
  const handleMouseEnter = (value) => {
    if (readOnly) return;
    setHover(value);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHover(0);
  };

  const getStarSize = () => {
    switch (size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  };

  const getStarColor = (starIndex) => {
    if (hover >= starIndex) {
      return '#FFD700'; // Dorado cuando hoover
    }
    if (rating >= starIndex) {
      return '#FFA500'; // Naranja Seleccinado
    }
    return '#DDD'; // Gris vacío
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            style={{
              fontSize: getStarSize(),
              color: getStarColor(starValue),
              cursor: readOnly ? 'default' : 'pointer',
              transition: 'color 0.2s ease',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        );
      })}
      {!readOnly && (
        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
          {rating > 0 ? `${rating}/${maxStars}` : 'Sin calificar'}
        </span>
      )}
    </div>
  );
};

export default Rating;