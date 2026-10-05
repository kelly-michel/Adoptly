-- Adoptly - Esquema de base de datos (PostgreSQL)
-- Corresponde a la sección 11 de la Fase 2 - Diseño

CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'FUNDACION', 'ADOPTANTE');
CREATE TYPE estado_animal AS ENUM ('DISPONIBLE', 'EN_PROCESO', 'ADOPTADO');
CREATE TYPE estado_solicitud AS ENUM ('PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA');
CREATE TYPE estado_cita AS ENUM ('PROGRAMADA', 'REALIZADA', 'CANCELADA');

CREATE TABLE usuarios (
  id              SERIAL PRIMARY KEY,
  nombre          VARCHAR(150) NOT NULL,
  correo          VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol             rol_usuario NOT NULL,
  ciudad          VARCHAR(100),
  fecha_registro  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE fundaciones (
  id           SERIAL PRIMARY KEY,
  usuario_id   INTEGER NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre       VARCHAR(150) NOT NULL,
  ubicacion    VARCHAR(200),
  descripcion  TEXT,
  telefono     VARCHAR(30)
);

CREATE TABLE animales (
  id              SERIAL PRIMARY KEY,
  fundacion_id    INTEGER NOT NULL REFERENCES fundaciones(id) ON DELETE CASCADE,
  nombre          VARCHAR(100) NOT NULL,
  especie         VARCHAR(50) NOT NULL,
  raza            VARCHAR(100),
  edad_aprox      VARCHAR(50),
  sexo            VARCHAR(20),
  tamano          VARCHAR(30),
  estado_salud    VARCHAR(150) NOT NULL,
  caracteristicas TEXT,
  foto_url        VARCHAR(500),
  estado          estado_animal NOT NULL DEFAULT 'DISPONIBLE',
  fecha_registro  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE solicitudes (
  id              SERIAL PRIMARY KEY,
  animal_id       INTEGER NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
  adoptante_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  estado          estado_solicitud NOT NULL DEFAULT 'PENDIENTE',
  fecha_solicitud TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE citas (
  id            SERIAL PRIMARY KEY,
  solicitud_id  INTEGER NOT NULL UNIQUE REFERENCES solicitudes(id) ON DELETE CASCADE,
  fecha         DATE NOT NULL,
  hora          TIME NOT NULL,
  lugar         VARCHAR(200) NOT NULL,
  estado        estado_cita NOT NULL DEFAULT 'PROGRAMADA'
);

CREATE TABLE adopciones (
  id              SERIAL PRIMARY KEY,
  solicitud_id    INTEGER NOT NULL UNIQUE REFERENCES solicitudes(id) ON DELETE CASCADE,
  fecha_adopcion  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_animales_fundacion ON animales(fundacion_id);
CREATE INDEX idx_animales_estado ON animales(estado);
CREATE INDEX idx_solicitudes_animal ON solicitudes(animal_id);
CREATE INDEX idx_solicitudes_adoptante ON solicitudes(adoptante_id);
