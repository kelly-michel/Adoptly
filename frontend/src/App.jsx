import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Busqueda from './pages/Busqueda.jsx';
import DetalleAnimal from './pages/DetalleAnimal.jsx';
import Login from './pages/Login.jsx';
import RegistroFundacion from './pages/RegistroFundacion.jsx';
import RegistroAdoptante from './pages/RegistroAdoptante.jsx';
import FormularioAnimal from './pages/FormularioAnimal.jsx';
import MisSolicitudes from './pages/MisSolicitudes.jsx';
import Home from './pages/Home.jsx';

function RutaPrivada({ rolRequerido, children }) {
  const { sesion } = useAuth();
  if (!sesion) return <Navigate to="/login" replace />;
  if (rolRequerido && sesion.usuario.rol !== rolRequerido) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { sesion, cerrarSesion } = useAuth();

  return (
    <div>
      <div className="barra-superior">
        <Link to="/">🐾 Adoptly</Link>
        {sesion ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>{sesion.usuario.nombre}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); cerrarSesion(); }}>Salir</a>
          </div>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}
      </div>

      <div className="contenedor">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/buscar" element={<Busqueda />} />
          <Route path="/animales/:id" element={<DetalleAnimal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro/fundacion" element={<RegistroFundacion />} />
          <Route path="/registro/adoptante" element={<RegistroAdoptante />} />
          <Route
            path="/fundacion/nuevo-animal"
            element={
              <RutaPrivada rolRequerido="FUNDACION">
                <FormularioAnimal />
              </RutaPrivada>
            }
          />
          <Route
            path="/mis-solicitudes"
            element={
              <RutaPrivada>
                <MisSolicitudes />
              </RutaPrivada>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
