const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { requireFields, isEmailValido } = require('../utils/validators');

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// HU01 - Como fundación, quiero registrarme en la plataforma
async function registrarFundacion(req, res, next) {
  const client = await pool.connect();
  try {
    const { nombre, correo, contrasena, ubicacion, descripcion, telefono } = req.body;
    requireFields(req.body, ['nombre', 'correo', 'contrasena', 'ubicacion']);

    if (!isEmailValido(correo)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido.' });
    }

    await client.query('BEGIN');

    const hash = await bcrypt.hash(contrasena, 10);
    const usuarioResult = await client.query(
      `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol)
       VALUES ($1, $2, $3, 'FUNDACION') RETURNING id, nombre, correo, rol`,
      [nombre, correo, hash]
    );
    const usuario = usuarioResult.rows[0];

    const fundacionResult = await client.query(
      `INSERT INTO fundaciones (usuario_id, nombre, ubicacion, descripcion, telefono)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, ubicacion, descripcion, telefono`,
      [usuario.id, nombre, ubicacion, descripcion || null, telefono || null]
    );

    await client.query('COMMIT');

    const token = generarToken(usuario);
    res.status(201).json({ token, usuario, fundacion: fundacionResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      err.status = 409;
      err.message = 'Ese correo ya está registrado.';
    }
    next(err);
  } finally {
    client.release();
  }
}

// HU04 - Como adoptante, quiero registrarme y crear mi perfil
async function registrarAdoptante(req, res, next) {
  try {
    const { nombre, correo, contrasena, ciudad } = req.body;
    requireFields(req.body, ['nombre', 'correo', 'contrasena', 'ciudad']);

    if (!isEmailValido(correo)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido.' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol, ciudad)
       VALUES ($1, $2, $3, 'ADOPTANTE', $4) RETURNING id, nombre, correo, rol, ciudad`,
      [nombre, correo, hash, ciudad]
    );
    const usuario = result.rows[0];
    const token = generarToken(usuario);
    res.status(201).json({ token, usuario });
  } catch (err) {
    if (err.code === '23505') {
      err.status = 409;
      err.message = 'Ese correo ya está registrado.';
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { correo, contrasena } = req.body;
    requireFields(req.body, ['correo', 'contrasena']);

    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const token = generarToken(usuario);
    delete usuario.contrasena_hash;
    res.json({ token, usuario });
  } catch (err) {
    next(err);
  }
}

module.exports = { registrarFundacion, registrarAdoptante, login };
