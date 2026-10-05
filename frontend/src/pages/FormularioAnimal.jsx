import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const inicial = {
  nombre: '', especie: '', raza: '', edad_aprox: '', sexo: '',
  tamano: '', estado_salud: '', caracteristicas: '', foto_url: '',
};

export default function FormularioAnimal() {
  const { sesion } = useAuth();
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
      const animal = await api.registrarAnimal(form, sesion.token);
      navigate(`/animales/${animal.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2 style={{ marginTop: 0 }}>Publicar animal en adopción</h2>

      <div className="campo">
        <label>Nombre</label>
        <input required value={form.nombre} onChange={set('nombre')} />
      </div>
      <div className="campo">
        <label>Especie</label>
        <input required placeholder="Perro, gato..." value={form.especie} onChange={set('especie')} />
      </div>
      <div className="campo">
        <label>Raza (opcional)</label>
        <input value={form.raza} onChange={set('raza')} />
      </div>
      <div className="campo">
        <label>Edad aproximada</label>
        <input required placeholder="Ej: 2 años, 6 meses" value={form.edad_aprox} onChange={set('edad_aprox')} />
      </div>
      <div className="campo">
        <label>Sexo (opcional)</label>
        <select value={form.sexo} onChange={set('sexo')}>
          <option value="">Selecciona...</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
      </div>
      <div className="campo">
        <label>Tamaño (opcional)</label>
        <select value={form.tamano} onChange={set('tamano')}>
          <option value="">Selecciona...</option>
          <option value="Pequeño">Pequeño</option>
          <option value="Mediano">Mediano</option>
          <option value="Grande">Grande</option>
        </select>
      </div>
      <div className="campo">
        <label>Estado de salud</label>
        <input required placeholder="Ej: Vacunado, esterilizado" value={form.estado_salud} onChange={set('estado_salud')} />
      </div>
      <div className="campo">
        <label>Características (opcional)</label>
        <textarea rows={3} value={form.caracteristicas} onChange={set('caracteristicas')} />
      </div>
      <div className="campo">
        <label>URL de foto (opcional)</label>
        <input placeholder="https://..." value={form.foto_url} onChange={set('foto_url')} />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="boton" disabled={cargando}>{cargando ? 'Publicando...' : 'Publicar'}</button>
    </form>
  );
}
