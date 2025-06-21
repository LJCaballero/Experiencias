import { useState, useEffect } from 'react';
import Loader from '../components/Loader';

export default function ListaExperiencias() {
  const [loading, setLoading] = useState(true); // Para el Loader
  const [experiencias, setExperiencias] = useState([]); // Para los datos

  useEffect(() => {
    // Aquí pides los datos al backend
    fetch('http://localhost:3001/experiences') // Cambia la URL si tu backend es otra
      .then(res => res.json())
      .then(data => {
        setExperiencias(data); // Guardas los datos
        setLoading(false);     // Quitas el Loader
      })
      .catch(() => setLoading(false)); // Si hay error, también quitas el Loader
  }, []);

  if (loading) return <Loader />; // Si está cargando, muestra el Loader

  // Si ya cargó, muestra la lista
  return (
    <div>
      <h1>Lista de Experiencias</h1>
      <ul>
        {experiencias.map(exp => (
          <li key={exp.id}>{exp.nombre}</li>
        ))}
      </ul>
    </div>
  );
}