const pool = require('../config/db');
const { requireFields } = require('../utils/validators');

// HU07 - Como adoptante, quiero manifestar interés en adoptar un animal
async function crearSolicitud(req, res, next) {
  try {
    const { animal_id } = req.body;
    requireFields(req.body, ['animal_id']);

    const animal = await pool.query(
      `SELECT id, estado FROM animales WHERE id = $1`,
      [animal_id]
    );
    if (animal.rows.length === 0) {
      return res.status(404).json({ error: 'El animal no existe.' });
    }
    if (animal.rows[0].estado !== 'DISPONIBLE') {
      return res.status(400).json({ error: 'Este animal ya no está disponible para adopción.' });
    }

    const result = await pool.query(
      `INSERT INTO solicitudes (animal_id, adoptante_id) VALUES ($1, $2) RETURNING *`,
      [animal_id, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// HU08 (fundación) y HU10 (adoptante) - listar solicitudes propias o recibidas, según el rol
async function listarSolicitudes(req, res, next) {
  try {
    if (req.user.rol === 'ADOPTANTE') {
      const result = await pool.query(
        `SELECT s.*, a.nombre AS animal_nombre, a.foto_url
         FROM solicitudes s JOIN animales a ON a.id = s.animal_id
         WHERE s.adoptante_id = $1 ORDER BY s.fecha_solicitud DESC`,
        [req.user.id]
      );
      return res.json(result.rows);
    }

    if (req.user.rol === 'FUNDACION') {
      const result = await pool.query(
        `SELECT s.*, a.nombre AS animal_nombre, a.foto_url, u.nombre AS adoptante_nombre, u.correo AS adoptante_correo
         FROM solicitudes s
         JOIN animales a ON a.id = s.animal_id
         JOIN fundaciones f ON f.id = a.fundacion_id
         JOIN usuarios u ON u.id = s.adoptante_id
         WHERE f.usuario_id = $1
         ORDER BY s.fecha_solicitud DESC`,
        [req.user.id]
      );
      return res.json(result.rows);
    }

    res.status(403).json({ error: 'Rol no autorizado para listar solicitudes.' });
  } catch (err) {
    next(err);
  }
}

// HU08 - Como fundación, quiero cambiar el estado de una solicitud
async function cambiarEstadoSolicitud(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido. Usa uno de: ${estadosValidos.join(', ')}` });
    }

    const result = await pool.query(
      `UPDATE solicitudes SET estado = $1 WHERE id = $2 RETURNING *`,
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada.' });
    }

    // Si se aprueba, el animal pasa a "en proceso" para que no reciba más solicitudes
    if (estado === 'APROBADA') {
      await pool.query(
        `UPDATE animales SET estado = 'EN_PROCESO'
         WHERE id = (SELECT animal_id FROM solicitudes WHERE id = $1)`,
        [id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { crearSolicitud, listarSolicitudes, cambiarEstadoSolicitud };
