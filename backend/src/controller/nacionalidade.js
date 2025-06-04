const NacionalidadeModel = require('../model/nacionalidade');

class NacionalidadeController {
    buscarTodas() {
        const nacionalidadeValue = NacionalidadeModel.findAll();
        return nacionalidadeValue;
    }
}

module.exports = new NacionalidadeController();