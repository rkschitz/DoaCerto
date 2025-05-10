const AlimentController = require('../controller/aliment');

class AlimentApi {
    async criarAlimento(req, res) {
        const {alimento, idUnidadeMedida} = req.body;
        try {
            const response = await BreedController.createBreed(alimento, idUnidadeMedida);
            return res.status(201).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao criar alimento ${error.message}` });
        }
    }

    async listarAlimentos(req, res){
        try {
            const response = await AlimentController.listarAlimentos();
            return res.status(200).send(response);
        } catch (error) {
            return res.status(400).send({ error: `Erro ao listar alimentos ${error.message}` });
        }
    }
}

module.exports = new AlimentApi();