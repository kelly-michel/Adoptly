import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const inicial = { nombre: '', correo: '', contrasena: '', ubicacion: '', descripcion: '', telefono: '' };

export default function RegistroFundacion() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(inicial);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function set(campo) {
    return (e) => setForm({ ...form, [campo]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      const { token, usuario } = await api.registrarFundacion(form);
      iniciarSesion(token, usuario);
      navigate('/fundacion/nuevo-animal');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2 style={{ marginTop: 0 }}>Registro de fundación</h2>
      <p className="ayuda">Publica los animales que tienes en adopción y organiza tus solicitudes en un solo lugar.</p>

      <div className="campo">
        <label>Nombre de la fundación</label>
        <input required value={form.nombre} onChange={set('nombre')} />
      </div>
      <div className="campo">
        <label>Correo</label>
        <input type="email" required value={form.correo} onChange={set('correo')} />
      </div>
      <div className="campo">
        <label>Contraseña</label>
        <input type="password" required minLength={6} value={form.contrasena} onChange={set('contrasena')} />
      </div>
      <div className="campo">
        <label>Ubicación</label>
        <input required placeholder="Ciudad, barrio" value={form.ubicacion} onChange={set('ubicacion')} />
      </div>
      <div className="campo">
        <label>Teléfono (opcional)</label>
        <input value={form.telefono} onChange={set('telefono')} />
      </div>
      <div className="campo">
        <label>Descripción (opcional)</label>
        <textarea rows={3} value={form.descripcion} onChange={set('descripcion')} />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="boton" disabled={cargando}>{cargando ? 'Creando cuenta...' : 'Crear cuenta de fundación'}</button>
    </form>
  );
}
