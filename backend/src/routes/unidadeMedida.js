const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const UnidadeMedidaApi = require("../api/unidadeMedida");

router.get("/", authMiddleware(), UnidadeMedidaApi.buscarTodas);

module.exports = router;