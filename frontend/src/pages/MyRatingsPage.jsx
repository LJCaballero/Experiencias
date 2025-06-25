import React, { useEffect, useState } from "react";
import axios from "axios";
import Rating from "../components/Rating";
import { useAuth } from "../context/AuthContext";

export default function MyRatingsPage() {
  const { token } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/ratings/my-ratings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRatings(response.data.ratings);
      } catch (err) {
        setError("No se pudieron cargar tus valoraciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [token]);

  if (loading) return <div className="main-content"><p>Cargando valoraciones...</p></div>;
  if (error) return <div className="main-content"><p>{error}</p></div>;

  return (
    <div className="main-content">
      <h2>Mis Valoraciones</h2>
      {ratings.length === 0 ? (
        <p>No has valorado ninguna experiencia todavía.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {ratings.map(rating => (
            <li key={rating.reservationId} style={{ marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
              <h3>{rating.experienceTitle}</h3>
              {rating.experienceImage && (
                <img src={rating.experienceImage} alt={rating.experienceTitle} style={{ width: 200, borderRadius: 8, marginBottom: 8 }} />
              )}
              <div style={{ margin: "8px 0" }}>
                <Rating initialRating={rating.rating} readOnly={true} size="medium" />
                <span style={{ marginLeft: 8 }}>({rating.rating}/5)</span>
              </div>
              <p><strong>Comentario:</strong> {rating.comment || "Sin comentario"}</p>
              <p><small>Valorado el: {new Date(rating.ratingDate).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}