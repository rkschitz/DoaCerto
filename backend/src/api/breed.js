const BreedController = require('../controller/breed');

class BreedApi {
    async createBreed(req, res) {
        const {breedId, name, weight, life_span, origin, temperament, image } = req.body;
        try {
            const response = await BreedController.createBreed(breedId, name, weight, life_span, origin, temperament, image);
            return res.status(201).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao criar raça ${error.message}` });
        }
    }

    async getApiBreeds(req, res) {
        try {
            const response = await BreedController.getApiBreeds();
            return res.status(201).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao criar raça ${error.message}` });
        }
    }

    async updateBreed(req, res) {
        const { breedId } = req.params;
        const {breed, weight, height, origin, temperament, image } = req.body;
        try {
            const response = await BreedController.update(breedId, breed, weight, height, temperament, origin, image);
            return res.status(200).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao atualizar raça ${error.message}` });
        }
    }

    async deleteBreed(req, res) {
        const { breedId } = req.params;
        try {
            const response = await BreedController.delete(breedId);
            return res.status(200).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao deletar raça ${error.message}` });
        }
    }

    async findBreed(req, res) {
        const { breedId } = req.params;
        try {
            const response = await BreedController.find(breedId);
            return res.status(200).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao buscar raça ${error.message}` });
        }
    }

    async listBreeds(req, res) {
        try {
            const response = await BreedController.list();
            return res.status(200).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao listar raças ${error.message}` });
        }
    }
}

module.exports = new BreedApi();
