import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Foto from '../Components/Foto.jsx';

export default function DetalleAnimal() {
  const { id } = useParams();
  const { sesion } = useAuth();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.detalleAnimal(id).then(setAnimal).catch((err) => setError(err.message));
  }, [id]);

  async function manifestarInteres() {
    if (!sesion) return navigate('/login');
    setEnviando(true);
    setError('');
    try {
      await api.crearSolicitud({ animal_id: Number(id) }, sesion.token);
      setMensaje('¡Listo! Tu solicitud fue enviada. La fundación la revisará pronto.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (error && !animal) return <p className="error">{error}</p>;
  if (!animal) return <p className="ayuda">Cargando...</p>;

  const esAdoptante = sesion?.usuario.rol === 'ADOPTANTE';

  return (
    <div>
      <Link to="/" className="ayuda" style={{ textDecoration: 'none' }}>← Volver a la búsqueda</Link>
      <div className="detalle tarjeta" style={{ marginTop: 10 }}>
        <Foto url={animal.foto_url} especie={animal.especie} nombre={animal.nombre} />

        <div>
          <h2 style={{ margin: '0 0 6px' }}>{animal.nombre}</h2>
          <span className={`etiqueta-estado estado-${animal.estado}`}>{animal.estado}</span>

          <div className="datos">
            <span className="dato">{animal.especie}{animal.raza ? ` · ${animal.raza}` : ''}</span>
            <span className="dato">{animal.edad_aprox}</span>
            {animal.sexo && <span className="dato">{animal.sexo}</span>}
            {animal.tamano && <span className="dato">Tamaño {animal.tamano.toLowerCase()}</span>}
          </div>

          <p><strong>Estado de salud:</strong> {animal.estado_salud}</p>
          {animal.caracteristicas && <p><strong>Sobre {animal.nombre}:</strong> {animal.caracteristicas}</p>}

          <div className="fundacion-box">
            <strong>{animal.fundacion_nombre}</strong>
            <div className="ayuda">📍 {animal.fundacion_ubicacion}</div>
            {animal.fundacion_telefono && <div className="ayuda">📞 {animal.fundacion_telefono}</div>}
          </div>

          {mensaje && (
            <p style={{ color: 'var(--verde)' }}>
              {mensaje} <Link to="/mis-solicitudes">Ver mis solicitudes</Link>
            </p>
          )}
          {error && <p className="error">{error}</p>}

          {animal.estado === 'DISPONIBLE' && !mensaje && (!sesion || esAdoptante) && (
            <button className="boton" onClick={manifestarInteres} disabled={enviando}>
              {enviando ? 'Enviando...' : sesion ? 'Me interesa adoptar' : 'Ingresa para adoptar'}
            </button>
          )}
          {sesion && !esAdoptante && (
            <p className="ayuda">Inicia sesión como adoptante para enviar una solicitud.</p>
          )}
        </div>
      </div>
    </div>
  );
}
