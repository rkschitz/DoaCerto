const express = require('express');
const UserBreedApi = require('../api/userBreed');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/',authMiddleware(), UserBreedApi.createUserBreed);
router.put('/:userBreedId',authMiddleware(), UserBreedApi.updateUserBreed);
router.delete('/unfavorite/:id',authMiddleware(), UserBreedApi.deleteUserBreed);
router.get('/',authMiddleware(), UserBreedApi.findAll);

module.exports = router;
