import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Foto from '../Components/Foto.jsx';

const LOCALIDADES = ['Chapinero', 'Usaquén', 'Suba', 'Kennedy', 'Teusaquillo'];

export default function Busqueda() {
  const { sesion } = useAuth();
  const [filtros, setFiltros] = useState({ especie: '', ubicacion: '' });
  const [animales, setAnimales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function buscar(nuevosFiltros = filtros) {
    setCargando(true);
    setError('');
    try {
      const data = await api.buscarAnimales(nuevosFiltros);
      setAnimales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { buscar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function elegirLocalidad(loc) {
    const nuevos = { ...filtros, ubicacion: filtros.ubicacion === loc ? '' : loc };
    setFiltros(nuevos);
    buscar(nuevos);
  }

  return (
    <div>
      <div className="hero">
        <h1>Encuentra a tu nuevo mejor amigo 🐾</h1>
        <p>Adoptly reúne en un solo lugar a los animales en adopción de las fundaciones de Bogotá.</p>
        <div className="cifras">
          <div className="cifra"><strong>{animales.length}</strong><span>animales disponibles</span></div>
          <div className="cifra"><strong>{new Set(animales.map((a) => a.fundacion_id)).size}</strong><span>fundaciones</span></div>
        </div>
      </div>

      {sesion?.usuario.rol === 'FUNDACION' && (
        <Link to="/fundacion/nuevo-animal" className="boton" style={{ display: 'block', textAlign: 'center', marginBottom: 16, textDecoration: 'none' }}>
          + Publicar animal en adopción
        </Link>
      )}

      <form className="filtros" onSubmit={(e) => { e.preventDefault(); buscar(); }}>
        <div className="campo">
          <label>Especie</label>
          <select value={filtros.especie} onChange={(e) => setFiltros({ ...filtros, especie: e.target.value })}>
            <option value="">Todas</option>
            <option value="perro">Perros</option>
            <option value="gato">Gatos</option>
          </select>
        </div>
        <div className="campo">
          <label>Ubicación</label>
          <input
            placeholder="Localidad o barrio (ej: Suba)"
            value={filtros.ubicacion}
            onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}
          />
        </div>
        <button className="boton" type="submit">Buscar</button>
      </form>

      <div className="chips">
        {LOCALIDADES.map((loc) => (
          <button key={loc} type="button" className={`chip ${filtros.ubicacion === loc ? 'activo' : ''}`} onClick={() => elegirLocalidad(loc)}>
            📍 {loc}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {cargando && <p className="ayuda">Buscando animales...</p>}
      {!cargando && animales.length === 0 && <p className="ayuda">No encontramos animales con esos filtros.</p>}

      <div className="grilla">
        {animales.map((a) => (
          <Link key={a.id} to={`/animales/${a.id}`} className="animal-card">
            <Foto url={a.foto_url} especie={a.especie} nombre={a.nombre} />
            <div className="animal-info">
              <h3>{a.nombre}</h3>
              <div className="animal-meta">
                {a.especie}{a.raza ? ` · ${a.raza}` : ''} · {a.edad_aprox}
              </div>
              <div className="ayuda" style={{ marginBottom: 8 }}>📍 {a.fundacion_nombre} — {a.fundacion_ubicacion}</div>
              <span className={`etiqueta-estado estado-${a.estado}`}>{a.estado}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
