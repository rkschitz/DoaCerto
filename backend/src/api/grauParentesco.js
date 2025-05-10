const GrauParentescoController = require('../controller/grauParentesco');

class GrauParentescoApi {
    async buscarTodos(req, res) {
        try {
            const response = await GrauParentescoController.buscarTodos();
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    }
}

module.exports = new GrauParentescoApi();