const express = require("express");

const authMiddleware = require("../middleware/auth");
const router = express.Router();
const PersonApi = require("../api/person");

router.get("/", authMiddleware(), PersonApi.searchPersons);
router.put("/:id", authMiddleware(), PersonApi.updatePerson);
router.get("/:id", authMiddleware(), PersonApi.searchPersonById);
router.post("/", authMiddleware(['A', 'O']), PersonApi.createPerson);
router.delete("/:id", authMiddleware(['A']), PersonApi.deletePerson);

module.exports = router;