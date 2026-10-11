import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Foto from '../Components/Foto.jsx';

const ESTADOS = ['PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA'];

function fechaCorta(f) {
  return f ? new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
}

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

  const conteo = ESTADOS.map((e) => [e, solicitudes.filter((s) => s.estado === e).length]);

  return (
    <div>
      <h2>{esFundacion ? 'Solicitudes recibidas' : 'Mis solicitudes'}</h2>

      {solicitudes.length > 0 && (
        <div className="chips">
          {conteo.map(([e, n]) => (
            <span key={e} className={`etiqueta-estado estado-${e}`}>{e.replace('_', ' ')}: {n}</span>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {cargando && <p className="ayuda">Cargando...</p>}
      {!cargando && solicitudes.length === 0 && <p className="ayuda">Todavía no hay solicitudes.</p>}

      {solicitudes.map((s) => (
        <div className="tarjeta solicitud" key={s.id}>
          <Foto url={s.foto_url} especie="" nombre={s.animal_nombre} className="" vacia="mini-vacia" />
          <div className="cuerpo">
            <strong>{s.animal_nombre}</strong>
            <span className={`etiqueta-estado estado-${s.estado}`} style={{ marginLeft: 8 }}>{s.estado.replace('_', ' ')}</span>
            <div className="ayuda">Enviada el {fechaCorta(s.fecha_solicitud)}</div>
            {esFundacion && <div className="ayuda">Adoptante: {s.adoptante_nombre} ({s.adoptante_correo})</div>}
          </div>

          {esFundacion && (
            <select
              value={s.estado}
              onChange={(e) => cambiarEstado(s.id, e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: '1px solid var(--borde)' }}
            >
              {ESTADOS.map((e) => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
