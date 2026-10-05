const { Router } = require('express');
const { registrarFundacion, registrarAdoptante, login } = require('../controllers/authController');

const router = Router();

router.post('/registro/fundacion', registrarFundacion);
router.post('/registro/adoptante', registrarAdoptante);
router.post('/login', login);

module.exports = router;
