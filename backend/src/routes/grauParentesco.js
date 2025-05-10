const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const GrauParentescoApi = require("../api/grauParentesco");

router.get("/", authMiddleware(), GrauParentescoApi.buscarTodos);

module.exports = router;