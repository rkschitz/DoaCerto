const MovimentacaoController = require("../controller/movimentacao")

class MovimentacaoApi {
    async listarMovimentacoes(req, res) {
        const { idOrganizacao } = req.session
        try {
            const response = await MovimentacaoController.listarMovimentacoes(idOrganizacao);
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async criar(req, res) {
        const { idOrganizacao } = req.session;
        const { ieMovimentacao, idCampanha, idDoador, idDonatario, alimentos } = req.body;
        console.log('Chegou aqui api')
        try {
            const response = await MovimentacaoController.criar(ieMovimentacao, idOrganizacao, idDoador, idDonatario, idCampanha,alimentos)
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async editar(req, res) {
        const { idOrganizacao } = req.session;
        const { idCampanha, idDoador, idDonatario, alimentos, idMovimentacao } = req.body;
        console.log(alimentos)

        try {
            const response = await MovimentacaoController.editar(idMovimentacao, idOrganizacao, idCampanha, idDoador, idDonatario, alimentos);
            if (response.success) {
                return res.status(200).send(response);
            } else {
                return res.status(400).send({ error: response.message });
            }
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new MovimentacaoApi();