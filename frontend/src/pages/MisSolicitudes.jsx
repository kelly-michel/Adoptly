import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const ESTADOS = ['PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA'];

export default function MisSolicitudes() {
  const { sesion } = useAuth();
  const esFundacion = sesion.usuario.rol === 'FUNDACION';

  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    try {
      const data = await api.misSolicitudes(sesion.token);
      setSolicitudes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function cambiarEstado(id, estado) {
    setError('');
    try {
      await api.cambiarEstadoSolicitud(id, estado, sesion.token);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>{esFundacion ? 'Solicitudes recibidas' : 'Mis solicitudes'}</h2>
      {error && <p className="error">{error}</p>}
      {cargando && <p className="ayuda">Cargando...</p>}
      {!cargando && solicitudes.length === 0 && <p className="ayuda">Todavía no hay solicitudes.</p>}

      {solicitudes.map((s) => (
        <div className="tarjeta" key={s.id}>
          <strong>{s.animal_nombre}</strong>
          <span className="etiqueta-estado" style={{ marginLeft: 8 }}>{s.estado}</span>

          {esFundacion && <p className="ayuda">Adoptante: {s.adoptante_nombre} ({s.adoptante_correo})</p>}

          {esFundacion && (
            <select
              value={s.estado}
              onChange={(e) => cambiarEstado(s.id, e.target.value)}
              style={{ marginTop: 8, padding: 8, borderRadius: 8, border: '1px solid var(--borde)' }}
            >
              {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
