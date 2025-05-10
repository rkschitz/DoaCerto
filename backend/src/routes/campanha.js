const express = require('express');
const CampanhaApi = require('../api/campanha');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/ativas', authMiddleware(['A','O']), CampanhaApi.listarAtivas);
router.post('/', authMiddleware(['A', 'O']), CampanhaApi.criar);

module.exports = router;
