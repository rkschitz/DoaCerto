const express = require('express');
const MovimentacaoApi = require('../api/movimentacao');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware(['A', 'O']), MovimentacaoApi.listarMovimentacoes);
router.post('/', authMiddleware(['A', 'O']), MovimentacaoApi.criar)
router.put('/:idMovimentacao', authMiddleware(['A', 'O']), MovimentacaoApi.editar)
router.delete('/:idMovimentacao', authMiddleware(['A', 'O']), MovimentacaoApi.excluir)

module.exports = router;
