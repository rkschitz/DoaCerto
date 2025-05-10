const pessoaController = require('../controller/pessoa')

class PessoaApi {
    async criar(req, res) {
        const { nome, cpf, telefone, email,dtNascimento, sexo, endereco } = req.body

        if (!nome || !cpf || !telefone || !dtNascimento || !email || !sexo || !endereco ) {
            return res.status(400).send("Nome, cpf, telefone, data de nascimento, email, sexo e endereço são obrigatórios")
        }
        try {
            const response = await pessoaController.criar(nome, cpf, telefone, email, dtNascimento, sexo, endereco)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async editar(req, res) {
        const { nome, cpf, telefone, dtNascimento, email, sexo, endereco } = req.body
        const { idPessoa } = req.params
        try {
            const response = await pessoaController.editar(idPessoa, nome, cpf, telefone,email,dtNascimento,sexo,endereco)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async deletar(req, res) {
        const { idPessoa } = req.params
        try {
            const response = await pessoaController.deletar(idPessoa)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async buscarTodos(req, res) {
        try {
            const response = await pessoaController.buscarTodos()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async buscarPorNomeCpf(req,res){
        const { nome, cpf } = req.query
        try {
            const response = await pessoaController.buscarPorNomeCpf(nome, cpf)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new PessoaApi