const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const PessoaApi = require("../api/pessoa");

router.get("/", authMiddleware(['A', 'O']), PessoaApi.buscarTodos);
router.post("/", authMiddleware(), PessoaApi.criar);
router.delete("/:idPessoa", authMiddleware(), PessoaApi.deletar);
router.put("/:idPessoa", authMiddleware(), PessoaApi.editar)

module.exports = router;