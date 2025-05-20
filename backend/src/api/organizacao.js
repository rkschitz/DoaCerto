const OrganizacaoController = require('../controller/organizacao');

class OrganizacaoApi {

    async criar(req, res) {
        const { organizacao, cnpj, telefone, email, secretaria, endereco } = req.body

        try {
            const response = await OrganizacaoController.criar(organizacao, cnpj, telefone, email, secretaria, endereco)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async editar(req, res) {
        const { organizacao, cnpj, telefone, email, senha, ieSituacao, idPessoa, endereco } = req.body
        const { idOrganizacao } = req.params

        try {
            const response = await OrganizacaoController.editar(idOrganizacao, organizacao, cnpj, telefone, email, senha, ieSituacao, idPessoa, endereco)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async buscarOrganizacoes(req, res) {
        try {
            const response = await OrganizacaoController.buscarOrganizacoes()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async buscarOrganizacoesAtivas(req, res) {
        try {
            const response = await OrganizacaoController.buscarOrganizacoesAtivas()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async buscarPorId(req, res) {
        const { idOrganizacao } = req.params

        try {
            const response = await OrganizacaoController.buscarPorId(idOrganizacao)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async deletar(req, res) {
        const { idOrganizacao } = req.params

        try {
            const response = await OrganizacaoController.deletar(idOrganizacao)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async login(req, res) {
        const { email, senha } = req.body

        try {
            const response = await OrganizacaoController.login(email, senha)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async listarAlimentosParaMovimentacao(req, res) {
        const { idOrganizacao } = req.session
        const { ieMovimentacao } = req.query

        try {
            const response = await OrganizacaoController.listarAlimentosParaMovimentacao(idOrganizacao, ieMovimentacao)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async listarAlimentosEmEstoque(req, res) {
        const { idOrganizacao } = req.session

        try {
            const response = await OrganizacaoController.listarAlimentosEmEstoque(idOrganizacao)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async validarDado(req, res) {
        const param = req.query

        try {
            const response = await OrganizacaoController.validarDado(param)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new OrganizacaoApi()