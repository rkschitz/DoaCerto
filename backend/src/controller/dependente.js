const dependenteModel = require('../model/dependente');
class DependenteController {
    async criar(idPessoa, idProvedor, idGrauParentesco) {
        try {
            const dependenteValue = await dependenteModel.create({
                idPessoa,
                idProvedor,
                idGrauParentesco
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async editar(idDependente, idGrauParentesco) {
        try {
            const dependenteValue = await dependenteModel.update({
                idGrauParentesco
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
            const dependenteValue = await dependenteModel.findAll({
                where: { idProvedor: idDonatario }
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async excluir(idDependente) {
        try {
            const dependenteValue = await dependenteModel.destroy({
                where: { idDependente }
            })
            return dependenteValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }
}

module.exports = new DependenteController();