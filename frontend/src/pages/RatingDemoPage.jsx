import React, { useState } from 'react';
import Rating from '../components/Rating';

const RatingDemoPage = () => {
  const [userRating, setUserRating] = useState(0);
  const [savedRatings, setSavedRatings] = useState([]);

  const handleRatingSubmit = () => {
    if (userRating > 0) {
      setSavedRatings([...savedRatings, userRating]);
      setUserRating(0);
      alert(`Rating ${userRating} guardado!`);
    }
  };

  const averageRating = savedRatings.length > 0 
    ? (savedRatings.reduce((sum, rating) => sum + rating, 0) / savedRatings.length).toFixed(1)
    : 0;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Demo del Componente Rating</h2>
      
      {/* Rating interactivo */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Califica esta experiencia:</h3>
        <Rating 
          initialRating={userRating}
          onRatingChange={setUserRating}
          size="large"
        />
        <button 
          onClick={handleRatingSubmit}
          disabled={userRating === 0}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: userRating > 0 ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: userRating > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Enviar Calificación
        </button>
      </div>

      {/* Mostrar ratings guardados */}
      {savedRatings.length > 0 && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Calificaciones recibidas:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            {savedRatings.map((rating, index) => (
              <Rating 
                key={index}
                initialRating={rating}
                readOnly={true}
                size="small"
              />
            ))}
          </div>
          <p><strong>Promedio: </strong>
            <Rating 
              initialRating={Math.round(averageRating)}
              readOnly={true}
              size="medium"
            />
            ({averageRating}/5 - {savedRatings.length} calificaciones)
          </p>
        </div>
      )}

      {/* Ejemplos de diferentes tamaños */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Diferentes tamaños y estados:</h3>

        {/* PEQUEÑO(LECTURA): Para una lista de experiencias donde monstramos el rating sin interaccion*/}
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Pequeño (lectura): </strong>
          <Rating initialRating={4} readOnly={true} size="small" />
        </div>

         {/* MEDIANO (INTERACTIVO): Para formularios en los que el usuario valore la experiencia */}
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Mediano (interactivo): </strong>
          <Rating initialRating={3} onRatingChange={(rating) => console.log('Rating:', rating)} />
        </div>

        {/* GRANDE(LECTURA): Para mostrar la valoracion de la exp. en un listado  */}
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Grande (lectura): </strong>
          <Rating initialRating={5} readOnly={true} size="large" />
        </div>
      </div>
    </div>
  );
};

export default RatingDemoPage;