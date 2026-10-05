const pool = require('../config/db');
const { requireFields } = require('../utils/validators');

// Obtiene el id de fundación asociado al usuario autenticado
async function obtenerFundacionIdDelUsuario(usuarioId) {
  const result = await pool.query('SELECT id FROM fundaciones WHERE usuario_id = $1', [usuarioId]);
  return result.rows[0]?.id || null;
}

// HU02 - Como fundación, quiero registrar un animal con su información y una foto
async function registrarAnimal(req, res, next) {
  try {
    const fundacionId = await obtenerFundacionIdDelUsuario(req.user.id);
    if (!fundacionId) {
      return res.status(403).json({ error: 'Tu usuario no tiene una fundación asociada.' });
    }

    const { nombre, especie, raza, edad_aprox, sexo, tamano, estado_salud, caracteristicas, foto_url } = req.body;
    requireFields(req.body, ['nombre', 'especie', 'edad_aprox', 'estado_salud']);

    const result = await pool.query(
      `INSERT INTO animales
        (fundacion_id, nombre, especie, raza, edad_aprox, sexo, tamano, estado_salud, caracteristicas, foto_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [fundacionId, nombre, especie, raza || null, edad_aprox, sexo || null, tamano || null, estado_salud, caracteristicas || null, foto_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// HU05 - Como adoptante, quiero buscar animales filtrando por especie, ubicación o fundación
async function buscarAnimales(req, res, next) {
  try {
    const { especie, ubicacion, fundacion_id } = req.query;

    const condiciones = [`a.estado = 'DISPONIBLE'`];
    const valores = [];

    if (especie) {
      valores.push(`%${especie}%`);
      condiciones.push(`a.especie ILIKE $${valores.length}`);
    }
    if (fundacion_id) {
      valores.push(fundacion_id);
      condiciones.push(`a.fundacion_id = $${valores.length}`);
    }
    if (ubicacion) {
      valores.push(`%${ubicacion}%`);
      condiciones.push(`f.ubicacion ILIKE $${valores.length}`);
    }

    const sql = `
      SELECT a.id, a.nombre, a.especie, a.raza, a.edad_aprox, a.sexo, a.tamano, a.foto_url, a.estado,
             f.id AS fundacion_id, f.nombre AS fundacion_nombre, f.ubicacion AS fundacion_ubicacion
      FROM animales a
      JOIN fundaciones f ON f.id = a.fundacion_id
      WHERE ${condiciones.join(' AND ')}
      ORDER BY a.fecha_registro DESC`;

    const result = await pool.query(sql, valores);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// HU06 - Como adoptante, quiero ver el detalle de un animal
async function detalleAnimal(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT a.*, f.nombre AS fundacion_nombre, f.ubicacion AS fundacion_ubicacion, f.telefono AS fundacion_telefono
       FROM animales a JOIN fundaciones f ON f.id = a.fundacion_id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// HU03 - Como fundación, quiero editar o dar de baja la información de un animal
async function editarAnimal(req, res, next) {
  try {
    const fundacionId = await obtenerFundacionIdDelUsuario(req.user.id);
    const { id } = req.params;

    const propio = await pool.query('SELECT fundacion_id FROM animales WHERE id = $1', [id]);
    if (propio.rows.length === 0) {
      return res.status(404).json({ error: 'Animal no encontrado.' });
    }
    if (propio.rows[0].fundacion_id !== fundacionId) {
      return res.status(403).json({ error: 'Solo puedes editar animales de tu propia fundación.' });
    }

    const campos = ['nombre', 'especie', 'raza', 'edad_aprox', 'sexo', 'tamano', 'estado_salud', 'caracteristicas', 'foto_url', 'estado'];
    const actualizables = campos.filter((c) => req.body[c] !== undefined);

    if (actualizables.length === 0) {
      return res.status(400).json({ error: 'No enviaste ningún campo para actualizar.' });
    }

    const sets = actualizables.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const valores = actualizables.map((c) => req.body[c]);
    valores.push(id);

    const result = await pool.query(
      `UPDATE animales SET ${sets} WHERE id = $${valores.length} RETURNING *`,
      valores
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function darDeBajaAnimal(req, res, next) {
  req.body = { estado: 'ADOPTADO' };
  // Dar de baja = dejar de mostrarlo como disponible; se reutiliza editarAnimal
  return editarAnimal(req, res, next);
}

module.exports = { registrarAnimal, buscarAnimales, detalleAnimal, editarAnimal, darDeBajaAnimal };
