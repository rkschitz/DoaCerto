const express = require('express');
const CampanhaApi = require('../api/campanha');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', CampanhaApi.listarTodas);
router.post('/', authMiddleware(['A', 'O']), CampanhaApi.criar);
router.put('/:idCampanha', authMiddleware(['A', 'O']), CampanhaApi.editar);

module.exports = router;
