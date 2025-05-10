const SituacaoHabitacionalController = require('../controller/situacaoHabitacional');

class SituacaoHabitacionalApi {
    async buscarTodas(req, res) {
        try {
            const response = await SituacaoHabitacionalController.buscarTodas()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

}

module.exports = new SituacaoHabitacionalApi()