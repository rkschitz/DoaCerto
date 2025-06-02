const NacionalidadeController = require('../controller/nacionalidade');

class NacionalidadeApi {
    async buscarTodas(req, res) {
        try {
            const response = await NacionalidadeController.buscarTodas()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

}

module.exports = new NacionalidadeApi()