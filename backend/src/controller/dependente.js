const DependenteModel = require('../model/dependente');
const DonatarioModel = require('../model/donatario')
const PessoaController = require('./pessoa')
const PessoaModel = require('../model/pessoa')
class DependenteController {
    async criar(idPessoa, idProvedor, idGrauParentesco) {

        const pessoaValue = await PessoaController.buscarPessoa(idPessoa);
        const isDependente = await this.buscarDonatarioPorDependente(idPessoa);

        if (isDependente) {
            throw new Error(`${pessoaValue?.dataValues?.nome} já está cadastro como dependente de ${isDependente?.dataValues?.pessoa?.nome}`)
        }

        const dependenteValue = await DependenteModel.create({
            idPessoa,
            idProvedor,
            idGrauParentesco
        })

        return dependenteValue;

    }

    async editar(idDependente, idGrauParentesco, idPessoa) {
        const dependenteValue = await DependenteModel.update({
            idGrauParentesco,
            idPessoa
        }, {
            where: { idDependente }
        })
        return dependenteValue;
    }

    async buscarDonatarioPorDependente(idDependente) {
        const dependenteValue = await DependenteModel.findOne({
            where: { idPessoa: idDependente },
        })
        return dependenteValue;
    }

    async excluir(idDependente) {
        const dependenteValue = await DependenteModel.destroy({
            where: { idDependente }
        })
        return dependenteValue;
    }

    async excluirPorDonatario(idDonatario) {
        const dependenteValue = await DependenteModel.destroy({
            where: { idProvedor: idDonatario }
        })
        return dependenteValue;
    }
}

module.exports = new DependenteController();