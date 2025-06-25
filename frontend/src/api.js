import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const getExperiences = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/experiences`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener experiencias:', error);
    throw error;
  }
};

export const getExperienceById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/experiences/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener experiencia:', error);
    throw error;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/reservas`,
      reservationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear reserva:', error);
    throw error;
  }
};