// HE COMENTADO LA RUTA Y DEMAS PARA QUE NO DE ERROR  Y ARREGALARLA CUANDO IMPLEMENTEMOS EL RECUPERAR CONTRASEÑA

import React, { useState } from 'react';
/*import axios from 'axios'; */

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSubmitted(false);

        /*try {
            const response = await axios.post('http://localhost:3001/api/recover-password', { email });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar el correo de recuperación');
        } finally {
            setLoading(false);
        }*/
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Recuperar Contraseña</h2>
            {submitted ? (
                <p style={{ color: 'green' }}>
                    Si el correo está registrado, se ha enviado un enlace de recuperación a tu correo electrónico.
                </p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Correo electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Cargando...' : 'Recuperar Contraseña'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
        </div>
    );
};

export default RecoverPassword;