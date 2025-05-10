const express = require('express');
const BreedApi = require('../api/breed');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/aliment', authMiddleware(['admin']), BreedApi.getApiBreeds);
router.post('/', authMiddleware(), BreedApi.createBreed);
router.put('/:breedId', authMiddleware(), BreedApi.updateBreed);
router.delete('/:breedId', authMiddleware(['admin']), BreedApi.deleteBreed);
router.get('/:breedId', authMiddleware(), BreedApi.findBreed);
router.get('/', authMiddleware(), BreedApi.listBreeds);

module.exports = router;
