const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const NacionalidadeApi = require("../api/nacionalidade");

router.get("/", authMiddleware(), NacionalidadeApi.buscarTodas);

module.exports = router;