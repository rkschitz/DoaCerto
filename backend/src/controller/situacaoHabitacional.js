const SituacaoHabitacional = require('../model/situacaoHabitacional');

class SituacaoHabitacionalController {
    buscarTodas() {
        const situacaoHabitacionalValue = SituacaoHabitacional.findAll();
        return situacaoHabitacionalValue;
    }
}

module.exports = new SituacaoHabitacionalController();