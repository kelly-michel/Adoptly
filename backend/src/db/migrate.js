// Aplica schema.sql contra la base de datos configurada en .env
// Uso: npm run migrate
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    console.log('Aplicando schema.sql...');
    await pool.query(sql);
    console.log('Listo. Tablas creadas correctamente.');
  } catch (err) {
    console.error('Error aplicando el esquema:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
