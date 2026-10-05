import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

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

  return (
    <div className="tarjeta">
      <h2 style={{ marginTop: 0 }}>{animal.nombre}</h2>
      <span className="etiqueta-estado">{animal.estado}</span>

      <p><strong>Especie:</strong> {animal.especie} {animal.raza ? `(${animal.raza})` : ''}</p>
      <p><strong>Edad aproximada:</strong> {animal.edad_aprox}</p>
      {animal.sexo && <p><strong>Sexo:</strong> {animal.sexo}</p>}
      {animal.tamano && <p><strong>Tamaño:</strong> {animal.tamano}</p>}
      <p><strong>Estado de salud:</strong> {animal.estado_salud}</p>
      {animal.caracteristicas && <p><strong>Características:</strong> {animal.caracteristicas}</p>}

      <hr />
      <p><strong>Fundación responsable:</strong> {animal.fundacion_nombre}</p>
      <p className="ayuda">{animal.fundacion_ubicacion}</p>

      {mensaje && <p style={{ color: 'var(--verde)' }}>{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      {animal.estado === 'DISPONIBLE' && !mensaje && (
        <button className="boton" onClick={manifestarInteres} disabled={enviando}>
          {enviando ? 'Enviando...' : 'Me interesa adoptar'}
        </button>
      )}
    </div>
  );
}
