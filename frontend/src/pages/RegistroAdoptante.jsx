import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const inicial = { nombre: '', correo: '', contrasena: '', ciudad: '' };

export default function RegistroAdoptante() {
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
      const { token, usuario } = await api.registrarAdoptante(form);
      iniciarSesion(token, usuario);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2 style={{ marginTop: 0 }}>Registro de adoptante</h2>
      <p className="ayuda">Crea tu perfil para enviar solicitudes de adopción y hacer seguimiento a tu proceso.</p>

      <div className="campo">
        <label>Nombre</label>
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
        <label>Ciudad</label>
        <input required value={form.ciudad} onChange={set('ciudad')} />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="boton" disabled={cargando}>{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</button>
    </form>
  );
}
