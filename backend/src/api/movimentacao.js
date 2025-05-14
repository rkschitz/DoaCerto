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
        try {
            const response = await MovimentacaoController.criar(ieMovimentacao, idOrganizacao, idDoador, idDonatario, idCampanha, alimentos)
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async editar(req, res) {
        const { idCampanha, idDoador, idDonatario, alimentos, idMovimentacao } = req.body;

        try {
            const response = await MovimentacaoController.editar(idMovimentacao, idCampanha, idDoador, idDonatario, alimentos);
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async excluir(req, res) {
        const { idMovimentacao } = req.params;

        try {
            const response = await MovimentacaoController.excluir(idMovimentacao);
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new MovimentacaoApi();