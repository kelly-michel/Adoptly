const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  crearSolicitud,
  listarSolicitudes,
  cambiarEstadoSolicitud,
} = require('../controllers/solicitudController');

const router = Router();

router.post('/', requireAuth, requireRole('ADOPTANTE'), crearSolicitud);
router.get('/', requireAuth, listarSolicitudes);
router.put('/:id/estado', requireAuth, requireRole('FUNDACION'), cambiarEstadoSolicitud);

module.exports = router;
