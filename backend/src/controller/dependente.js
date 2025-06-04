const DependenteModel = require('../model/dependente');
class DependenteController {
    async criar(idPessoa, idProvedor, idGrauParentesco) {
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

    async buscarDependentesPorDonatario(idDonatario) {
        const dependenteValue = await DependenteModel.findAll({
            where: { idProvedor: idDonatario }
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