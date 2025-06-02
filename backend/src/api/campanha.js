const CampanhaController = require('../controller/campanha');

class CampanhaApi {
    async criar(req, res) {
        const { titulo, descricao, dtInicio, dtFinal, metas } = req.body;
        const { idOrganizacao } = req.session;

        try {
            const campanha = await CampanhaController.criar(
                titulo,
                descricao,
                dtInicio,
                dtFinal,
                idOrganizacao,
                metas);
            res.status(201).json(campanha);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async listarTodas(req, res) {
        const param = req.query;

        try {
            const campanhas = await CampanhaController.listarTodas(param);
            res.status(200).json(campanhas);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async editar(req, res) {
        const { idCampanha } = req.params;
        const { titulo, descricao, dtInicio, dtFinal, ieSituacao, metas } = req.body;

        try {
            const campanha = await CampanhaController.editar(idCampanha, titulo, descricao, dtInicio, dtFinal, ieSituacao, metas);
            res.status(200).json({ campanha });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


}

module.exports = new CampanhaApi();