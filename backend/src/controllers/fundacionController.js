const pool = require('../config/db');

async function listarFundaciones(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, nombre, ubicacion, descripcion, telefono FROM fundaciones ORDER BY nombre`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function detalleFundacion(req, res, next) {
  try {
    const { id } = req.params;
    const fundacion = await pool.query('SELECT * FROM fundaciones WHERE id = $1', [id]);

    if (fundacion.rows.length === 0) {
      return res.status(404).json({ error: 'Fundación no encontrada.' });
    }

    const animales = await pool.query(
      `SELECT id, nombre, especie, estado, foto_url FROM animales
       WHERE fundacion_id = $1 AND estado = 'DISPONIBLE' ORDER BY fecha_registro DESC`,
      [id]
    );

    res.json({ ...fundacion.rows[0], animales: animales.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { listarFundaciones, detalleFundacion };
