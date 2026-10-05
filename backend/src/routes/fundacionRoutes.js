const { Router } = require('express');
const { listarFundaciones, detalleFundacion } = require('../controllers/fundacionController');

const router = Router();

router.get('/', listarFundaciones);
router.get('/:id', detalleFundacion);

module.exports = router;
