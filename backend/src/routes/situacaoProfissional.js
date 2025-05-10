const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const SituacaoProfissionalApi = require("../api/situacaoProfissional");

router.get("/", authMiddleware(), SituacaoProfissionalApi.buscarTodas);

module.exports = router;