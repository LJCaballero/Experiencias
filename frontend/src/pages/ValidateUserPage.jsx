
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ValidateUserPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`http://localhost:3001/users/validate-user${token}`);
                setStatus('success');
                setMessage('Usuario validado correctamente. Puedes iniciar sesión ahora.');
                setTimeout(() => {
                    navigate('/login');
                }, 3001); 
            }
            catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Error al validar el usuario. El token puede haber expirado o ser inválido.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center', paddingTop: '3rem' }}>
        {status === 'validating' && <p>Validando su cuenta...</p>}
        {status === 'success' && <p style={{ color: 'green' }}>{message}</p>}
        {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default ValidateUserPage;