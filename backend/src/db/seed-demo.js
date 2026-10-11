// Datos de demostración ampliados: varias fundaciones de Bogotá, ~25 animales y solicitudes en distintos estados.
// Uso:   npm run seed:demo
//        npm run seed:demo -- tucorreo@ejemplo.com   (además agrega animales y solicitudes a TU fundación)
// Es seguro correrlo varias veces: no duplica usuarios, animales ni solicitudes.
// Las fundaciones y personas de este archivo son ficticias, solo para mostrar el avance del proyecto.
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const CLAVE_DEMO = 'Demo2026*';
const U = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=70`;

const FUNDACIONES = [
  {
    correo: 'huellitas@demo.adoptly.co', nombre: 'Huellitas del Norte', ubicacion: 'Usaquén, Bogotá', telefono: '3105550101',
    descripcion: 'Hogar de paso para perros rescatados en el norte de la ciudad.',
    animales: [
      { nombre: 'Rocky', especie: 'Perro', raza: 'Pastor mestizo', edad: '3 años', sexo: 'Macho', tamano: 'Grande', salud: 'Vacunado y esterilizado', desc: 'Leal y protector, necesita paseos largos todos los días.', foto: U('1587300003388-59208cc962cb') },
      { nombre: 'Canela', especie: 'Perro', raza: 'Criolla', edad: '1 año', sexo: 'Hembra', tamano: 'Mediano', salud: 'Vacunada, pendiente esterilización', desc: 'Juguetona y muy cariñosa, se lleva bien con niños.', foto: U('1518717758536-85ae29035b6d') },
      { nombre: 'Simón', especie: 'Perro', raza: 'Schnauzer mestizo', edad: '5 años', sexo: 'Macho', tamano: 'Pequeño', salud: 'Vacunado y esterilizado', desc: 'Tranquilo, ideal para apartamento y personas mayores.', foto: U('1583511655857-d19b40a7a54e') },
      { nombre: 'Thor', especie: 'Perro', raza: 'Husky mestizo', edad: '2 años', sexo: 'Macho', tamano: 'Grande', salud: 'Vacunado y esterilizado', desc: 'Muy energético, necesita espacio y mucha actividad.', foto: U('1561037404-61cd46aa615b') },
      { nombre: 'Lola', especie: 'Perro', raza: 'Beagle mestiza', edad: '4 años', sexo: 'Hembra', tamano: 'Mediano', salud: 'Vacunada y esterilizada', desc: 'Dócil y sociable, convive bien con otros perros.', foto: U('1537151625747-768eb6cf92b2') },
    ],
  },
  {
    correo: 'patasfelices@demo.adoptly.co', nombre: 'Patas Felices Suba', ubicacion: 'Suba, Bogotá', telefono: '3115550102',
    descripcion: 'Rescatamos y rehabilitamos perros y gatos abandonados en Suba.',
    animales: [
      { nombre: 'Nala', especie: 'Gato', raza: 'Mestiza', edad: '8 meses', sexo: 'Hembra', tamano: 'Pequeño', salud: 'Vacunada y desparasitada', desc: 'Curiosa y juguetona, le encantan los rascadores.', foto: U('1514888286974-6c03e2ca1dba') },
      { nombre: 'Bruno', especie: 'Perro', raza: 'Labrador mestizo', edad: '6 años', sexo: 'Macho', tamano: 'Grande', salud: 'Vacunado y esterilizado', desc: 'Un viejo sabio: calmado, obediente y muy agradecido.', foto: U('1548199973-03cce0bbc87b') },
      { nombre: 'Pelusa', especie: 'Gato', raza: 'Angora mestiza', edad: '2 años', sexo: 'Hembra', tamano: 'Pequeño', salud: 'Vacunada y esterilizada', desc: 'Pelaje largo y suave, muy tranquila y cariñosa.', foto: U('1573865526739-10659fec78a5') },
      { nombre: 'Coco', especie: 'Perro', raza: 'Poodle mestizo', edad: '2 años', sexo: 'Macho', tamano: 'Pequeño', salud: 'Vacunado y esterilizado', desc: 'Alegre y listo, aprende trucos muy rápido.', foto: U('1568572933382-74d440642117') },
      { nombre: 'Mishi', especie: 'Gato', raza: 'Naranja mestizo', edad: '1 año', sexo: 'Macho', tamano: 'Mediano', salud: 'Vacunado, pendiente esterilización', desc: 'Sociable, le gusta dormir sobre las piernas.', foto: U('1495360010541-f48722b34f7d') },
    ],
  },
  {
    correo: 'nuevohogar@demo.adoptly.co', nombre: 'Refugio Nuevo Hogar Kennedy', ubicacion: 'Kennedy, Bogotá', telefono: '3125550103',
    descripcion: 'Refugio comunitario que recibe animales de la calle y les busca familia.',
    animales: [
      { nombre: 'Oso', especie: 'Perro', raza: 'Mestizo', edad: '7 meses', sexo: 'Macho', tamano: 'Mediano', salud: 'En proceso de vacunación', desc: 'Cachorro lleno de energía, perfecto para una familia activa.', foto: U('1425082661705-1834bfd09dca') },
      { nombre: 'Kira', especie: 'Perro', raza: 'Pitbull mestiza', edad: '3 años', sexo: 'Hembra', tamano: 'Mediano', salud: 'Vacunada y esterilizada', desc: 'Cariñosa y noble, necesita un hogar con experiencia.', foto: U('1543466835-00a7907e9de1') },
      { nombre: 'Pancho', especie: 'Perro', raza: 'Criollo', edad: '9 años', sexo: 'Macho', tamano: 'Mediano', salud: 'Vacunado y esterilizado', desc: 'Senior tranquilo que solo quiere compañía y una cama calientita.', foto: U('1552053831-71594a27632d') },
      { nombre: 'Frida', especie: 'Gato', raza: 'Carey', edad: '3 años', sexo: 'Hembra', tamano: 'Pequeño', salud: 'Vacunada y esterilizada', desc: 'Independiente pero muy dulce cuando coge confianza.', foto: U('1574158622682-e40e69881006') },
      { nombre: 'Zeus', especie: 'Perro', raza: 'Rottweiler mestizo', edad: '4 años', sexo: 'Macho', tamano: 'Grande', salud: 'Vacunado y esterilizado', desc: 'Fuerte y obediente, ideal para casa con patio.', foto: U('1548199973-03cce0bbc87b') },
    ],
  },
  {
    correo: 'gatosteusaquillo@demo.adoptly.co', nombre: 'Gatos de Teusaquillo', ubicacion: 'Teusaquillo, Bogotá', telefono: '3135550104',
    descripcion: 'Colectivo vecinal dedicado al rescate y adopción de gatos.',
    animales: [
      { nombre: 'Dulce', especie: 'Gato', raza: 'Siamesa mestiza', edad: '5 meses', sexo: 'Hembra', tamano: 'Pequeño', salud: 'En proceso de vacunación', desc: 'Gatita muy vocal y mimosa, busca hogar con compañía.', foto: U('1596854407944-bf87f6fdd49e') },
      { nombre: 'Rufo', especie: 'Gato', raza: 'Atigrado', edad: '4 años', sexo: 'Macho', tamano: 'Mediano', salud: 'Vacunado y esterilizado', desc: 'Tranquilo y observador, perfecto para apartamento.', foto: U('1514888286974-6c03e2ca1dba') },
      { nombre: 'Maya', especie: 'Gato', raza: 'Negra mestiza', edad: '2 años', sexo: 'Hembra', tamano: 'Pequeño', salud: 'Vacunada y esterilizada', desc: 'Elegante y cariñosa, se lleva bien con otros gatos.', foto: U('1573865526739-10659fec78a5') },
      { nombre: 'Cleo', especie: 'Gato', raza: 'Mestiza', edad: '1 año', sexo: 'Hembra', tamano: 'Pequeño', salud: 'Vacunada, pendiente esterilización', desc: 'Juguetona, le fascinan las plumas y las cajas de cartón.', foto: U('1533738363-b7f9aef128ce') },
    ],
  },
];

// Animales extra para la Fundación Ruffo (creada con "npm run seed")
const EXTRAS_RUFFO = [
  { nombre: 'Tango', especie: 'Perro', raza: 'Cocker mestizo', edad: '3 años', sexo: 'Macho', tamano: 'Mediano', salud: 'Vacunado y esterilizado', desc: 'Amigable y juguetón, le encanta jugar con la pelota.', foto: U('1537151625747-768eb6cf92b2') },
  { nombre: 'Chispa', especie: 'Gato', raza: 'Mestiza', edad: '10 meses', sexo: 'Hembra', tamano: 'Pequeño', salud: 'Vacunada y desparasitada', desc: 'Pequeña terremoto con mucha curiosidad.', foto: U('1596854407944-bf87f6fdd49e') },
];

// Animales que recibe TU fundación si pasas tu correo como argumento
const EXTRAS_PROPIA = [
  { nombre: 'Gala', especie: 'Perro', raza: 'Golden mestiza', edad: '2 años', sexo: 'Hembra', tamano: 'Grande', salud: 'Vacunada y esterilizada', desc: 'Dulce y paciente, excelente con niños.', foto: U('1552053831-71594a27632d') },
  { nombre: 'Bolt', especie: 'Perro', raza: 'Mestizo', edad: '1 año', sexo: 'Macho', tamano: 'Mediano', salud: 'Vacunado, pendiente esterilización', desc: 'Veloz y divertido, ama correr en el parque.', foto: U('1518717758536-85ae29035b6d') },
  { nombre: 'Nube', especie: 'Gato', raza: 'Blanca mestiza', edad: '6 meses', sexo: 'Hembra', tamano: 'Pequeño', salud: 'En proceso de vacunación', desc: 'Suave como su nombre, muy tranquila.', foto: U('1573865526739-10659fec78a5') },
  { nombre: 'Manchas', especie: 'Gato', raza: 'Bicolor', edad: '3 años', sexo: 'Macho', tamano: 'Mediano', salud: 'Vacunado y esterilizado', desc: 'Amistoso, le gusta recibir a las visitas.', foto: U('1495360010541-f48722b34f7d') },
];

const ADOPTANTES = [
  { nombre: 'Andrés Gómez', correo: 'andres.gomez@demo.adoptly.co', ciudad: 'Bogotá' },
  { nombre: 'Laura Martínez', correo: 'laura.martinez@demo.adoptly.co', ciudad: 'Bogotá' },
  { nombre: 'Sebastián Pardo', correo: 'sebastian.pardo@demo.adoptly.co', ciudad: 'Bogotá' },
  { nombre: 'Valentina Ríos', correo: 'valentina.rios@demo.adoptly.co', ciudad: 'Bogotá' },
];

// [animal, correo del adoptante, estado, hace cuántos días]
const SOLICITUDES = [
  ['Rocky', 'andres.gomez@demo.adoptly.co', 'PENDIENTE', 1],
  ['Canela', 'laura.martinez@demo.adoptly.co', 'EN_REVISION', 3],
  ['Nala', 'camila.rodriguez@example.com', 'EN_REVISION', 2],
  ['Bruno', 'sebastian.pardo@demo.adoptly.co', 'APROBADA', 6],
  ['Pelusa', 'valentina.rios@demo.adoptly.co', 'PENDIENTE', 1],
  ['Kira', 'andres.gomez@demo.adoptly.co', 'RECHAZADA', 8],
  ['Dulce', 'laura.martinez@demo.adoptly.co', 'PENDIENTE', 2],
  ['Rufo', 'camila.rodriguez@example.com', 'PENDIENTE', 4],
  ['Luna', 'sebastian.pardo@demo.adoptly.co', 'PENDIENTE', 2],
  ['Max', 'valentina.rios@demo.adoptly.co', 'EN_REVISION', 5],
  ['Tango', 'andres.gomez@demo.adoptly.co', 'PENDIENTE', 1],
];
// Solicitudes hacia tu propia fundación (solo si pasas tu correo)
const SOLICITUDES_PROPIAS = [
  ['Gala', 'camila.rodriguez@example.com', 'PENDIENTE', 1],
  ['Bolt', 'laura.martinez@demo.adoptly.co', 'EN_REVISION', 2],
  ['Nube', 'valentina.rios@demo.adoptly.co', 'PENDIENTE', 3],
  ['Manchas', 'andres.gomez@demo.adoptly.co', 'APROBADA', 5],
];

async function upsertUsuario(client, { nombre, correo, contrasena, rol, ciudad = null }) {
  const ex = await client.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
  if (ex.rows[0]) return ex.rows[0].id;
  const hash = await bcrypt.hash(contrasena, 10);
  const r = await client.query(
    `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol, ciudad) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [nombre, correo, hash, rol, ciudad]
  );
  return r.rows[0].id;
}

async function asegurarAnimales(client, fundacionId, lista) {
  let nuevos = 0;
  for (const a of lista) {
    const ex = await client.query('SELECT id FROM animales WHERE fundacion_id = $1 AND nombre = $2', [fundacionId, a.nombre]);
    if (ex.rows[0]) continue;
    await client.query(
      `INSERT INTO animales (fundacion_id, nombre, especie, raza, edad_aprox, sexo, tamano, estado_salud, caracteristicas, foto_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [fundacionId, a.nombre, a.especie, a.raza, a.edad, a.sexo, a.tamano, a.salud, a.desc, a.foto]
    );
    nuevos++;
  }
  return nuevos;
}

async function crearSolicitudes(client, lista) {
  let creadas = 0;
  for (const [nombreAnimal, correo, estado, dias] of lista) {
    const an = await client.query('SELECT id FROM animales WHERE nombre = $1 ORDER BY id LIMIT 1', [nombreAnimal]);
    const us = await client.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
    if (!an.rows[0] || !us.rows[0]) continue; // si falta alguno (ej. no corriste "npm run seed"), se omite
    const ex = await client.query('SELECT id FROM solicitudes WHERE animal_id = $1 AND adoptante_id = $2', [an.rows[0].id, us.rows[0].id]);
    if (ex.rows[0]) continue;
    await client.query(
      `INSERT INTO solicitudes (animal_id, adoptante_id, estado, fecha_solicitud)
       VALUES ($1,$2,$3, NOW() - make_interval(days => $4))`,
      [an.rows[0].id, us.rows[0].id, estado, dias]
    );
    if (estado === 'APROBADA') {
      await client.query(`UPDATE animales SET estado = 'EN_PROCESO' WHERE id = $1`, [an.rows[0].id]);
    }
    creadas++;
  }
  return creadas;
}

async function seedDemo() {
  const correoPropio = process.argv[2];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let totalAnimales = 0;

    for (const f of FUNDACIONES) {
      const usuarioId = await upsertUsuario(client, { nombre: f.nombre, correo: f.correo, contrasena: CLAVE_DEMO, rol: 'FUNDACION' });
      let fr = await client.query('SELECT id FROM fundaciones WHERE usuario_id = $1', [usuarioId]);
      if (!fr.rows[0]) {
        fr = await client.query(
          `INSERT INTO fundaciones (usuario_id, nombre, ubicacion, descripcion, telefono) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
          [usuarioId, f.nombre, f.ubicacion, f.descripcion, f.telefono]
        );
      }
      totalAnimales += await asegurarAnimales(client, fr.rows[0].id, f.animales);
    }

    const ruffo = await client.query(
      `SELECT f.id FROM fundaciones f JOIN usuarios u ON u.id = f.usuario_id WHERE u.correo = 'contacto@fundacionruffo.org'`
    );
    if (ruffo.rows[0]) totalAnimales += await asegurarAnimales(client, ruffo.rows[0].id, EXTRAS_RUFFO);

    for (const a of ADOPTANTES) {
      await upsertUsuario(client, { ...a, contrasena: CLAVE_DEMO, rol: 'ADOPTANTE' });
    }

    let totalSolicitudes = await crearSolicitudes(client, SOLICITUDES);

    let mensajePropio = '';
    if (correoPropio) {
      const mia = await client.query(
        `SELECT f.id, f.nombre FROM fundaciones f JOIN usuarios u ON u.id = f.usuario_id WHERE u.correo = $1`,
        [correoPropio]
      );
      if (mia.rows[0]) {
        totalAnimales += await asegurarAnimales(client, mia.rows[0].id, EXTRAS_PROPIA);
        totalSolicitudes += await crearSolicitudes(client, SOLICITUDES_PROPIAS);
        mensajePropio = `\n  Tu fundación "${mia.rows[0].nombre}" ahora tiene animales y solicitudes de ejemplo.`;
      } else {
        mensajePropio = `\n  AVISO: no encontré una fundación con el correo ${correoPropio}. Regístrala primero en la página y vuelve a correr el comando.`;
      }
    }

    await client.query('COMMIT');

    console.log(`Datos de demostración listos (${totalAnimales} animales y ${totalSolicitudes} solicitudes nuevas).`);
    console.log(`\n  Fundaciones de ejemplo (clave de todas: ${CLAVE_DEMO}):`);
    FUNDACIONES.forEach((f) => console.log(`   - ${f.nombre}: ${f.correo}`));
    console.log(`\n  Adoptantes de ejemplo (clave: ${CLAVE_DEMO}):`);
    ADOPTANTES.forEach((a) => console.log(`   - ${a.nombre}: ${a.correo}`));
    console.log(mensajePropio);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error insertando datos de demostración:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDemo();
