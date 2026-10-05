// Inserta datos de ejemplo para poder mostrar un avance funcional.
// Uso: npm run seed
// Es seguro correrlo varias veces: si el correo ya existe, lo detecta y no duplica.
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function upsertUsuario(client, { nombre, correo, contrasena, rol, ciudad = null }) {
  const existente = await client.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
  if (existente.rows[0]) return existente.rows[0].id;

  const hash = await bcrypt.hash(contrasena, 10);
  const result = await client.query(
    `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol, ciudad)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [nombre, correo, hash, rol, ciudad]
  );
  return result.rows[0].id;
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // --- Fundación Ruffo ---
    const usuarioFundacionId = await upsertUsuario(client, {
      nombre: 'Fundación Ruffo',
      correo: 'contacto@fundacionruffo.org',
      contrasena: 'Ruffo2026*',
      rol: 'FUNDACION',
    });

    let fundacionId;
    const fundExistente = await client.query(
      'SELECT id FROM fundaciones WHERE usuario_id = $1',
      [usuarioFundacionId]
    );
    if (fundExistente.rows[0]) {
      fundacionId = fundExistente.rows[0].id;
    } else {
      const fundResult = await client.query(
        `INSERT INTO fundaciones (usuario_id, nombre, ubicacion, descripcion, telefono)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          usuarioFundacionId,
          'Fundación Ruffo',
          'Bogotá, Chapinero',
          'Fundación dedicada al rescate y adopción responsable de perros y gatos en Bogotá.',
          '3001234567',
        ]
      );
      fundacionId = fundResult.rows[0].id;
    }

    // --- Animales de ejemplo ---
    const { rows: animalesExistentes } = await client.query(
      'SELECT COUNT(*)::int AS n FROM animales WHERE fundacion_id = $1',
      [fundacionId]
    );

    if (animalesExistentes[0].n === 0) {
      const animales = [
        {
          nombre: 'Toby',
          especie: 'Perro',
          raza: 'Mestizo',
          edad_aprox: '2 años',
          sexo: 'Macho',
          tamano: 'Mediano',
          estado_salud: 'Vacunado y esterilizado',
          caracteristicas: 'Muy juguetón, sociable con otros perros, ideal para familia con patio.',
          foto_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600',
        },
        {
          nombre: 'Luna',
          especie: 'Gato',
          raza: 'Mestiza',
          edad_aprox: '1 año',
          sexo: 'Hembra',
          tamano: 'Pequeño',
          estado_salud: 'Vacunada, pendiente esterilización',
          caracteristicas: 'Tranquila, cariñosa, se adapta bien a apartamentos.',
          foto_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600',
        },
        {
          nombre: 'Max',
          especie: 'Perro',
          raza: 'Labrador mestizo',
          edad_aprox: '4 años',
          sexo: 'Macho',
          tamano: 'Grande',
          estado_salud: 'Vacunado y esterilizado',
          caracteristicas: 'Entrenado en obediencia básica, excelente con niños.',
          foto_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600',
        },
        {
          nombre: 'Mia',
          especie: 'Gato',
          raza: 'Siamés mestiza',
          edad_aprox: '6 meses',
          sexo: 'Hembra',
          tamano: 'Pequeño',
          estado_salud: 'En proceso de vacunación',
          caracteristicas: 'Muy curiosa y activa, recomendable para hogar sin otras mascotas por ahora.',
          foto_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600',
        },
      ];

      for (const a of animales) {
        await client.query(
          `INSERT INTO animales
             (fundacion_id, nombre, especie, raza, edad_aprox, sexo, tamano, estado_salud, caracteristicas, foto_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            fundacionId,
            a.nombre,
            a.especie,
            a.raza,
            a.edad_aprox,
            a.sexo,
            a.tamano,
            a.estado_salud,
            a.caracteristicas,
            a.foto_url,
          ]
        );
      }
    }

    // --- Adoptante de ejemplo ---
    const usuarioAdoptanteId = await upsertUsuario(client, {
      nombre: 'Camila Rodríguez',
      correo: 'camila.rodriguez@example.com',
      contrasena: 'Adoptante2026*',
      rol: 'ADOPTANTE',
      ciudad: 'Bogotá',
    });

    // --- Solicitud de ejemplo (para poder mostrar "Mis solicitudes") ---
    const { rows: solicitudesExistentes } = await client.query(
      'SELECT COUNT(*)::int AS n FROM solicitudes WHERE adoptante_id = $1',
      [usuarioAdoptanteId]
    );

    if (solicitudesExistentes[0].n === 0) {
      const { rows: primerAnimal } = await client.query(
        'SELECT id FROM animales WHERE fundacion_id = $1 ORDER BY id LIMIT 1',
        [fundacionId]
      );
      if (primerAnimal[0]) {
        await client.query(
          `INSERT INTO solicitudes (animal_id, adoptante_id, estado)
           VALUES ($1, $2, 'PENDIENTE')`,
          [primerAnimal[0].id, usuarioAdoptanteId]
        );
      }
    }

    await client.query('COMMIT');

    console.log('Datos de ejemplo listos:\n');
    console.log('  Fundación  -> correo: contacto@fundacionruffo.org  clave: Ruffo2026*');
    console.log('  Adoptante  -> correo: camila.rodriguez@example.com  clave: Adoptante2026*');
    console.log('\n  4 animales publicados por la Fundación Ruffo.');
    console.log('  1 solicitud de adopción pendiente creada.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error insertando datos de ejemplo:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
