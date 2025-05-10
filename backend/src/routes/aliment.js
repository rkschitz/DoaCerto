const express = require('express');
const AlimentApi = require('../api/aliment');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['A']), AlimentApi.criarAlimento);
router.get('/', authMiddleware(), AlimentApi.listarAlimentos);

// router.post('/', authMiddleware(), BreedApi.createBreed);
// router.put('/:breedId', authMiddleware(), BreedApi.updateBreed);
// router.delete('/:breedId', authMiddleware(['admin']), BreedApi.deleteBreed);
// router.get('/:breedId', authMiddleware(), BreedApi.findBreed);
// router.get('/', authMiddleware(), BreedApi.listBreeds);

module.exports = router;
