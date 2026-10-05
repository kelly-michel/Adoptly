import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const guardada = localStorage.getItem('adoptly_sesion');
    return guardada ? JSON.parse(guardada) : null;
  });

  useEffect(() => {
    if (sesion) {
      localStorage.setItem('adoptly_sesion', JSON.stringify(sesion));
    } else {
      localStorage.removeItem('adoptly_sesion');
    }
  }, [sesion]);

  const iniciarSesion = (token, usuario) => setSesion({ token, usuario });
  const cerrarSesion = () => setSesion(null);

  return (
    <AuthContext.Provider value={{ sesion, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
