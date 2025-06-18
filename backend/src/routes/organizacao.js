const express = require('express');
const OrganizacaoApi = require('../api/organizacao');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['A']), OrganizacaoApi.criar);
router.get('/', authMiddleware(['A']), OrganizacaoApi.buscarOrganizacoes);
router.get('/ativas', authMiddleware(['A']), OrganizacaoApi.buscarOrganizacoesAtivas);
router.get('/alimentos_movimentacao', authMiddleware(['A', 'O']), OrganizacaoApi.listarAlimentosParaMovimentacao);
router.get('/validar_dados', authMiddleware(['A', 'O']), OrganizacaoApi.validarDado);
router.get('/alimentos_estoque', authMiddleware(['A','O']), OrganizacaoApi.listarAlimentosEmEstoque)
router.put('/:idOrganizacao', authMiddleware(['A', 'O']), OrganizacaoApi.editar);
router.get('/:idOrganizacao', authMiddleware(['A', 'O']), OrganizacaoApi.buscarPorId);
router.delete('/:idOrganizacao', authMiddleware(['A']), OrganizacaoApi.deletar);

module.exports = router;
