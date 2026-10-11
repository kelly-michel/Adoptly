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
        <Link to="/" className="marca">🐾 Adoptly</Link>
        <div className="menu">
          <Link to="/">Animales</Link>
          {sesion?.usuario.rol === 'FUNDACION' && <Link to="/fundacion/nuevo-animal">Publicar animal</Link>}
          {sesion && (
            <Link to="/mis-solicitudes">
              {sesion.usuario.rol === 'FUNDACION' ? 'Solicitudes recibidas' : 'Mis solicitudes'}
            </Link>
          )}
          {sesion ? (
            <>
              <span className="usuario">{sesion.usuario.nombre}</span>
              <a href="#" onClick={(e) => { e.preventDefault(); cerrarSesion(); }}>Salir</a>
            </>
          ) : (
            <>
              <Link to="/registro/adoptante">Registrarme</Link>
              <Link to="/login">Ingresar</Link>
            </>
          )}
        </div>
      </div>

      <div className="contenedor">
        <Routes>
          <Route path="/" element={<Busqueda />} />
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
        <div className="pie">Adoptly · Proyecto de Práctica Aplicada · Sprint 1</div>
      </div>
    </div>
  );
}
