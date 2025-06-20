// src/pages/UserPage.jsx

import { useState, useEffect } from "react";

function UserPage({ onCerrar }) {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/api/user")
        .then((response) => response.json())
        .then((data) => {
            setUsers(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!users) {
        return <div>Error al cargar el perfil</div>;
    }

    return (
        <div className="panel-perfil">
        <button onClick={onCerrar} className="cerrar-button" aria-label="Cerrar perfil">
            X
        </button>
        <img src={users.avatar} alt="avatar" className="perfil-avatar" />
        <h2>
            {users.firstName} {users.lastName}
        </h2>
        <p className="email">{users.email}</p>
        <p className="bio">{users.bio}</p>
        <button className="edit-button">Editar Perfil</button>
    </div>
    );
}

export default UserPage;
