const express = require('express');
const DonatarioApi = require('../api/donatario');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['A', 'O']), DonatarioApi.criar);
router.get('/', authMiddleware(['A', 'O']), DonatarioApi.buscarTodos);
router.put('/:idDonatario', authMiddleware(['A', 'O']), DonatarioApi.editar);
router.delete('/:idDonatario', authMiddleware(['A', 'O']), DonatarioApi.excluir);
// router.get('/', authMiddleware(['A','O']), DonatarioApi.buscarDonatarios);
// router.get('/ativas', authMiddleware(['A','O']), DonatarioApi.buscarDonatariosAtivos);
// router.get('/:idDonatario', authMiddleware(['A','O']), DonatarioApi.buscarPorId);

module.exports = router;
