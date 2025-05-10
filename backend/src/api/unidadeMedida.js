const UnidadeMedidaController = require('../controller/unidadeMedida');

class UnidadeMedidaApi {
    async buscarTodas(req, res) {
        try {
            const response = await UnidadeMedidaController.buscarTodos()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

}

module.exports = new UnidadeMedidaApi()