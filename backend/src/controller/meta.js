const MetaModel = require("../model/meta");

class MetaController {

    async criar(meta, idCampanha, idAlimento, idUnidadeMedida) {
        const novaMeta = await MetaModel.create({
            meta: meta,
            idCampanha: idCampanha,
            idAlimento: idAlimento,
            idUnidadeMedida: idUnidadeMedida
        });
        return novaMeta;
    }
}

module.exports = new MetaController();