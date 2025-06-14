
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    //le he metido un estado de cargando la pagina, para ver los logs en la consola

    const [loading, setLoading]= useState(true)

    useEffect(()=> {
        console.log('Cargando los datos del local Storage');

        try {
            const savedToken =localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
                console.log('datos encotrados en local Storage');
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } else {
                console.log('No hay datos guardados');
            }
        } catch (error) {
            console.log('Error al cargar los datos',error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        } 
        

    }, []);

    // Funcion de login para guardarlo en el localstorage

    const login = (newToken, newUser) => {
        console.log('Login aceptado', newUser.email );

        setToken(newToken);
        setUser(newUser);

        //Nos aseguramos de guardarlo en el Local Storage

        try {
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', newUser);
            console.log('Datos guradados en el local Storage');

        } catch (error) {
         console.error('Error al guuardar en LocalStorage',error);    
        }
    };

    // Funcion de Logaot y limpiamos el Local Storage

    const logout = () => {
        console.log('Cerrando sesion...');

        setToken(null);
        setUser(null);

        //Limpia

        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('datos eliminados...');
        } catch (error){
            console.error('Error al limpiar..', error);
        }
    };

    // Actualizacion de los datos en el local Storage

    const updateUser = (updatedUser) => {
        console.log(' Actualizando  al usuario:', updatedUser);
        
        setUser(updatedUser);
        
        // Actualizar en localStorage también
        try {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error(' Error al actualizar usuario en local Storage:', error);
        }
    };

    // Verificacion de si es user o AAdmin

    const isAuthenticated = Boolean(token && user);
    const isAdmin = Boolean(user && user.role === 'admin');

    const value = {
        user,
        token,
        loading,
        
        isAuthenticated,
        isAdmin,
    
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error ('useAuth debe usarse dentro de un AuthProvider')
    }
    return context;
}