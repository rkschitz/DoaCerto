const DependenteModel = require('../model/dependente');
class DependenteController {
    async criar(idPessoa, idProvedor, idGrauParentesco) {
        try {
            const dependenteValue = await DependenteModel.create({
                idPessoa,
                idProvedor,
                idGrauParentesco
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async editar(idDependente, idGrauParentesco, idPessoa) {
        try {
            const dependenteValue = await DependenteModel.update({
                idGrauParentesco,
                idPessoa
            }, {
                where: { idDependente }
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async buscarDependentesPorDonatario(idDonatario) {
        try {
            const dependenteValue = await DependenteModel.findAll({
                where: { idProvedor: idDonatario }
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async excluir(idDependente) {
        try {
            const dependenteValue = await DependenteModel.destroy({
                where: { idDependente }
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async excluirPorDonatario(idDonatario) {
        try {
            const dependenteValue = await DependenteModel.destroy({
                where: { idProvedor: idDonatario }
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }
}

module.exports = new DependenteController();