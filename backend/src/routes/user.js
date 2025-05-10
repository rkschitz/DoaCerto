const express = require("express");

const UserApi = require("../api/user");
const UserBreedApi = require("../api/userBreed");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware(['admin']),UserApi.findUsers); 
router.get("/context", authMiddleware(), UserApi.findContext);

router.put("/:id", authMiddleware(), UserApi.updateUser);
router.delete("/:id", authMiddleware(), UserApi.deleteUser);
router.post("/admin", authMiddleware(['admin']), UserApi.createUser);
router.get("/:id/breeds", authMiddleware(), UserBreedApi.listUserBreedsByUser);


module.exports = router;