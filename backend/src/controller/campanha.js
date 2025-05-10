const CampanhaModel = require('../model/campanha');

class CampanhaController {
    async criar(titulo, descricao, dtInicio, dtFinal, idOrganizacao) {
        if (!titulo || !descricao || !dtInicio || !dtFinal) {
            throw new Error('Todos os campos são obrigatórios');
        }

        const campanha = await CampanhaModel.create({
            titulo,
            descricao,
            dtInicio,
            dtFinal,
            idOrganizacao
        });
        return campanha;

    }

    async listarAtivas(idOrganizacao) {
        if (idOrganizacao === 1) {
            const campanhas = await CampanhaModel.findAll({ where: { ieSituacao: 'A' } });
            return campanhas;
        } else {
            const campanhas = await CampanhaModel.findAll({ where: { idOrganizacao, ieSituacao: 'A' } });
            return campanhas;
        }
    }
}

module.exports = new CampanhaController();