import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Busqueda() {
  const { sesion } = useAuth();
  const [filtros, setFiltros] = useState({ especie: '', ubicacion: '' });
  const [animales, setAnimales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function buscar(e) {
    e?.preventDefault();
    setCargando(true);
    setError('');
    try {
      const data = await api.buscarAnimales(filtros);
      setAnimales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { buscar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {sesion?.usuario.rol === 'FUNDACION' && (
        <Link to="/fundacion/nuevo-animal" className="boton" style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
          + Publicar animal en adopción
        </Link>
      )}

      <form className="tarjeta" onSubmit={buscar}>
        <div className="campo">
          <label>Especie</label>
          <input
            placeholder="Ej: perro, gato..."
            value={filtros.especie}
            onChange={(e) => setFiltros({ ...filtros, especie: e.target.value })}
          />
        </div>
        <div className="campo">
          <label>Ubicación</label>
          <input
            placeholder="Ciudad o barrio"
            value={filtros.ubicacion}
            onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}
          />
        </div>
        <button className="boton" type="submit">Buscar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {cargando && <p className="ayuda">Buscando animales...</p>}
      {!cargando && animales.length === 0 && <p className="ayuda">No encontramos animales con esos filtros.</p>}

      {animales.map((a) => (
        <Link key={a.id} to={`/animales/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="tarjeta">
            <strong>{a.nombre}</strong> · {a.especie}
            <div className="ayuda">{a.fundacion_nombre} — {a.fundacion_ubicacion}</div>
            <span className="etiqueta-estado">{a.estado}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
