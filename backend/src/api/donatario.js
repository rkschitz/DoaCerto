const DonatarioController = require('../controller/donatario')
class DonatarioApi {
    async criar(req, res) {

        const { idPessoa,
            idSituacaoHabitacional,
            tempoResidencia,
            rendaFamiliar,
            idSituacaoProfissional,
            cadastroCras,
            outroLocal,
            enfermoNaCasa,
            situacaoEnfermo,
            dataCadastro,
            responsavelVisita,
            observacao,
            dtEntregaCesta,
            dependentes,
            nacionalidade } = req.body;

        const { idOrganizacao } = req.session
        try {

            const donatarioValue = await DonatarioController.criar(
                idPessoa,
                idSituacaoHabitacional,
                tempoResidencia,
                rendaFamiliar,
                idSituacaoProfissional,
                cadastroCras,
                outroLocal,
                enfermoNaCasa,
                situacaoEnfermo,
                dataCadastro,
                idOrganizacao,
                responsavelVisita,
                observacao,
                dtEntregaCesta,
                dependentes,
                nacionalidade
            )

            return res.status(200).send(donatarioValue);
        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    }

    async editar(req, res) {

        const {
            idDonatario,
            idPessoa,
            idSituacaoHabitacional,
            tempoResidencia,
            rendaFamiliar,
            idSituacaoProfissional,
            cadastroCras,
            outroLocal,
            enfermoNaCasa,
            situacaoEnfermo,
            dataCadastro,
            responsavelVisita,
            situacao,
            observacao,
            dtEntregaCesta,
            dependentes } = req.body;

        try {
            const donatarioValue = await DonatarioController.editar(
                idDonatario,
                idPessoa,
                idSituacaoHabitacional,
                tempoResidencia,
                rendaFamiliar,
                idSituacaoProfissional,
                cadastroCras,
                outroLocal,
                enfermoNaCasa,
                situacaoEnfermo,
                dataCadastro,
                responsavelVisita,
                situacao,
                observacao,
                dtEntregaCesta,
                dependentes
            )

            return res.status(200).send(donatarioValue);
        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    }

    async excluir(req, res) {
        const { idDonatario } = req.params;
        try {
            const donatarioValue = await DonatarioController.excluir(idDonatario);
            return res.status(200).send(donatarioValue);
        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    }

    async buscarAtivos(req, res) {
        const { nome, cpf } = req.query
        try {
            const response = await DonatarioController.buscarAtivos({ nome, cpf });
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new DonatarioApi();