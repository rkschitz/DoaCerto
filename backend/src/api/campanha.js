const CampanhaController = require('../controller/campanha');

class CampanhaApi {
    async criar(req, res) {
        const { titulo, descricao, dtInicio, dtFinal, ieSituacao } = req.body;
        const { idOrganizacao } = req.session;
        try {
            const campanha = await CampanhaController.criar(
                titulo,
                descricao,
                dtInicio,
                dtFinal,
                ieSituacao,
                idOrganizacao
            );
            res.status(201).json(campanha);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async listarTodas(req, res) {
        const { idOrganizacao, ativos } = req.query;

        try {
            const campanhas = await CampanhaController.listarTodas(idOrganizacao, ativos);
            res.status(200).json(campanhas);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


}

module.exports = new CampanhaApi();