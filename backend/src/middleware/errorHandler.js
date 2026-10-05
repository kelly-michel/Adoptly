// Manejo de errores centralizado: nunca deja al frontend con un fallo silencioso
// (condición técnica "Manejo de errores visible" del enunciado)
function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === '23505') {
    // violación de restricción UNIQUE en PostgreSQL
    return res.status(409).json({ error: 'El registro ya existe (dato duplicado).' });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Ocurrió un error inesperado en el servidor.' : err.message;
  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
