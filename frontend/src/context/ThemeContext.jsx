import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Lee el tema guardado en localStorage al cargar la página
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Guarda el tema en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Aplica clase al <body>
  }, [theme]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}