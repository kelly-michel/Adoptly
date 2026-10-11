import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      const { token, usuario } = await api.login(form);
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
      <h2 style={{ marginTop: 0 }}>Ingresar</h2>

      <div className="campo">
        <label>Correo</label>
        <input type="email" required value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
      </div>
      <div className="campo">
        <label>Contraseña</label>
        <input type="password" required value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="boton" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar'}</button>

      <p className="ayuda" style={{ marginTop: 16 }}>
        ¿No tienes cuenta?{' '}
        <Link to="/registro/adoptante">Regístrate como adoptante</Link> o{' '}
        <Link to="/registro/fundacion">como fundación</Link>.
      </p>
    </form>

    
  );
}
