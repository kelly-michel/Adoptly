const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fundacionRoutes = require('./routes/fundacionRoutes');
const animalRoutes = require('./routes/animalRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, servicio: 'Adoptly API' }));

app.use('/api/auth', authRoutes);
app.use('/api/fundaciones', fundacionRoutes);
app.use('/api/animales', animalRoutes);
app.use('/api/solicitudes', solicitudRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
