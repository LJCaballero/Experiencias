import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';      // <--- SIN llaves
import ThemeContext from '../context/ThemeContext';    // <--- SIN llaves


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`navbar ${theme}`}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>Experiencias Únicas</Link>
      <div style={{ display: 'inline' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Inicio</Link>
        {!user && (
          <>
            <Link to="/login" style={{ marginRight: '15px' }}>Iniciar Sesión</Link>
            <Link to="/register" style={{ marginRight: '15px' }}>Registrarse</Link>
          </>
        )}
        <Link to="/rating-demo" style={{ marginRight: '15px' }}>Demo Rating</Link>
        <Link to="/experiences" style={{ marginRight: '15px' }}>Experiencias</Link>
        {user ? (
          <>
            <Link to="/profile" style={{ marginRight: '15px' }}>Mi perfil</Link>
            <button onClick={logout} style={{ marginRight: '15px' }}>Cerrar sesión</button>
          </>
        ) : null}
        <button onClick={toggleTheme} style={{ fontSize: '1.2em' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}