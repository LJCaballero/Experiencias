
import React, { useState } from 'react';
import './Rating.css'; 

const Rating = ({ 
  initialRating = 0, 
  maxStars = 5, 
  onRatingChange,
  readOnly = false,
  size = 'medium' 
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (starNumber) => {
    if (readOnly) return;
    setRating(starNumber);
    if (onRatingChange) {
      onRatingChange(starNumber);
    }
  };

  return (
    <div className="rating-container">
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        
        return (
          <button
            key={index}
            onClick={() => handleClick(starNumber)}
            disabled={readOnly}
            className={`
              rating-star 
              rating-star-${size}
              ${isFilled ? 'rating-star-filled' : 'rating-star-empty'}
              ${readOnly ? 'rating-star-readonly' : 'rating-star-interactive'}
            `}
          >
            ★
          </button>
        );
      })}
      
      {!readOnly && (
        <span className="rating-text">
          {rating > 0 ? `${rating}/${maxStars}` : 'Sin calificar'}
        </span>
      )}
    </div>
  );
};

export default Rating;