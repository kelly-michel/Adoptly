function requireFields(body, fields) {
  const faltantes = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (faltantes.length > 0) {
    const err = new Error(`Faltan campos obligatorios: ${faltantes.join(', ')}`);
    err.status = 400;
    throw err;
  }
}

function isEmailValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

module.exports = { requireFields, isEmailValido };
