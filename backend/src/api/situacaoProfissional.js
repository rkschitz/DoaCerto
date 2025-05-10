const SituacaoProfissionalController = require('../controller/situacaoProfissional');

class SituacaoProfissionalApi {
    async buscarTodas(req, res) {
        try {
            const response = await SituacaoProfissionalController.buscarTodas()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

}

module.exports = new SituacaoProfissionalApi()