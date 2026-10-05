const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  registrarAnimal,
  buscarAnimales,
  detalleAnimal,
  editarAnimal,
  darDeBajaAnimal,
} = require('../controllers/animalController');

const router = Router();

router.get('/', buscarAnimales); // GET /api/animales?especie=&ubicacion=&fundacion_id=
router.get('/:id', detalleAnimal);
router.post('/', requireAuth, requireRole('FUNDACION'), registrarAnimal);
router.put('/:id', requireAuth, requireRole('FUNDACION'), editarAnimal);
router.delete('/:id', requireAuth, requireRole('FUNDACION'), darDeBajaAnimal);

module.exports = router;
