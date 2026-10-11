# Adoptly — Sprint 1

Sistema web para unificar el proceso de adopción de mascotas de varias
fundaciones (hoy gestionado por WhatsApp), comenzando por la Fundación Ruffo.

Cubre el flujo mínimo de valor (historias de prioridad Alta del Product
Backlog): registro de fundación y adoptante, publicación de animales,
búsqueda con filtros y solicitud de adopción.

## Estructura

```
adoptly/
  backend/   API REST (Node.js + Express + PostgreSQL + JWT)
  frontend/  Interfaz web (React + Vite)
```

## 1. Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior (local o en la nube, ej. Railway/Supabase/Neon)

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `.env` con los datos de tu base de datos PostgreSQL (host, puerto,
nombre, usuario, contraseña) y cambia `JWT_SECRET` por un valor propio.

Crea la base de datos vacía (una sola vez):

```bash
# con psql, o desde la herramienta gráfica que uses (pgAdmin, DBeaver, etc.)
createdb adoptly
```

Aplica el esquema (crea las 6 tablas):

```bash
npm run migrate
```

Carga datos de ejemplo (Fundación Ruffo con 4 animales, un adoptante y una
solicitud pendiente), para tener algo que mostrar de una vez:

```bash
npm run seed
```

Para una demostración más completa (4 fundaciones más, ~25 animales, 4 adoptantes y
solicitudes en distintos estados), corre además:

```bash
npm run seed:demo
# o, para que TU fundación (registrada en la página) también reciba animales y solicitudes:
npm run seed:demo -- tucorreo@ejemplo.com
```

Todas las cuentas de ejemplo del demo usan la clave `Demo2026*`.

Levanta el servidor:

```bash
npm run dev
```

La API queda en `http://localhost:4000`. Verifica que responde:
`http://localhost:4000/api/health` debe devolver `{"ok":true,...}`.

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Ya apunta a `http://localhost:4000/api`
por defecto (puedes cambiarlo con una variable `VITE_API_URL` si lo
despliegas en otro lado).

## 4. Flujo para probar el Sprint 1

1. Entra a `/registro/fundacion` y crea la Fundación Ruffo (o de prueba).
2. Con esa sesión, publica 2-3 animales desde "Publicar animal en adopción".
3. Cierra sesión y regístrate como adoptante en `/registro/adoptante`.
4. Busca animales por especie/ubicación en la pantalla de inicio.
5. Entra al detalle de un animal y pulsa "Me interesa adoptar".
6. Inicia sesión otra vez como la fundación y ve a "Mis solicitudes" para
   aprobar o rechazar la solicitud recibida.

## 5. Pendientes para la sustentación

- **Repositorio de GitHub**: sube este código a un repo del equipo con
  acceso para el docente, y haz commits distribuidos en el tiempo (no todo
  de una sola vez) — es una condición técnica explícita del enunciado.
- **Tablero en Planner** con el Sprint Backlog y bitácora de Daily.
- **Excepción de equipo de 3 personas**: confirmar con el docente antes de
  sustentar (el enunciado exige 4 por norma).
- **Integración externa de geolocalización**: todavía no está conectada
  (la búsqueda por "ubicación" hoy es texto libre contra el campo de la
  fundación). Es la siguiente pieza técnica a resolver — vale la pena
  priorizarla porque cierra una de las 7 condiciones técnicas del curso.
- Pruebas contra una base de datos PostgreSQL real (aquí solo se verificó
  que el servidor arranca y que el frontend compila sin errores).

## 6. Siguiente paso sugerido (Fase 3 — Scrum)

Con este código como base, lo natural es armar el Sprint Backlog formal
(tareas técnicas desglosadas por historia, con estimación) y dejarlo
reflejado en Planner, además de la integración de geolocalización
mencionada arriba.
