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

    async buscarMetaPorCampanha(idCampanha) {
        const metas = await MetaModel.findAll({
            where: {
                idCampanha: idCampanha
            }
        });
        return metas;
    }

    async editar(idMeta, meta, idCampanha, idAlimento, idUnidadeMedida) {
        const metaAtualizada = await MetaModel.update({
            meta: meta,
            idCampanha: idCampanha,
            idAlimento: idAlimento,
            idUnidadeMedida: idUnidadeMedida
        }, {
            where: {
                idMeta: idMeta
            }
        });
        return metaAtualizada;
    }
}

module.exports = new MetaController();