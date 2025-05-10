const PersonController = require('../controller/person')

class PersonApi {

    async createPerson(req, res) {
        const { CPF, name, email, password, number, birthdate, role } = req.body

        try {
            const response = await PersonController.createPerson(CPF, name, email, password, number, birthdate, role)
            if (response.dataValues) {
                const responseLogin = await PersonController.login(email, password);
                return res.status(200).send(responseLogin)
            }
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async updatePerson(req, res) {
        const { CPF, name, email, password, number, birthdate, role, ieSituation, idAdress } = req.body
        const { id } = req.params

        try {
            const response = await PersonController.updatePerson(id, CPF, name, email, password, number, birthdate,role, ieSituation, idAdress)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async searchPersons(req, res) {
        try {
            const response = await PersonController.searchPersons()
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async searchPersonById(req, res) {
        const { idPessoa } = req.params

        try {
            const response = await PersonController.searchPersonById(idPessoa)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async login(req, res) {
        const { email, password } = req.body

        try {
            const response = await PersonController.login(email, password)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async deletePerson(req, res) {
        const { id } = req.params
        try {
            const response = await PersonController.deletePerson(id)
            return res.status(200).send(response)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new PersonApi()