const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const SituacaoHabitacionalApi = require("../api/situacaoHabitacional");

router.get("/", authMiddleware(), SituacaoHabitacionalApi.buscarTodas);

module.exports = router;