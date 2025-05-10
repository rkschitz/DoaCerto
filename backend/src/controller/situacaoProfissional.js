const SituacaoProfissional = require('../model/situacaoProfissional');

class SituacaoProfissionalController {
    buscarTodas() {
        const situacaoProfissionalValue = SituacaoProfissional.findAll();
        return situacaoProfissionalValue;
    }
}

module.exports = new SituacaoProfissionalController();