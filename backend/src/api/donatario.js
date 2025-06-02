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
            dependentes,
            idNacionalidade,
            secretariaCadastro } = req.body;

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
                dependentes,
                idNacionalidade,
                secretariaCadastro
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
            dataVisita,
            situacaoCadastral,
            observacao,
            idNacionalidade,
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
                observacao,
                dependentes,
                idNacionalidade,
                dataVisita,
                situacaoCadastral
            )
            return res.status(200).send(donatarioValue)
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

    async buscarTodos(req, res) {
        const { nome, cpf, situacaoCadastral } = req.query
        try {
            const response = await DonatarioController.buscarTodos(nome, cpf, situacaoCadastral);
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new DonatarioApi();