import React, { useState } from 'react';

export function emojiDe(especie = '') {
  const e = especie.toLowerCase();
  if (e.includes('gato')) return '🐱';
  if (e.includes('perro')) return '🐶';
  if (e.includes('conejo')) return '🐰';
  return '🐾';
}

// Muestra la foto del animal; si no hay foto o el enlace falla, muestra un ícono de respaldo
export default function Foto({ url, especie, nombre, className = 'animal-foto', vacia = 'animal-foto-vacia' }) {
  const [fallo, setFallo] = useState(false);

  if (!url || fallo) {
    return <div className={vacia} aria-label={nombre}>{emojiDe(especie)}</div>;
  }
  return <img className={className} src={url} alt={nombre} loading="lazy" onError={() => setFallo(true)} />;
}
