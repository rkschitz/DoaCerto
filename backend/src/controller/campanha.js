const CampanhaModel = require('../model/campanha');
const MetaModel = require('../model/meta');
const AlimentoModel = require('../model/alimento');
const UnidadeMedidaModel = require('../model/unidadeMedida');
const MetaController = require('../controller/meta')
const { buscarQuantidadeEntradaPorMeta } = require('./movimentacao');

class CampanhaController {
    async criar(titulo, descricao, dtInicio, dtFinal, idOrganizacao, metas = []) {
        if (!titulo || !descricao) {
            throw new Error('Todos os campos são obrigatórios');
        }

        const campanha = await CampanhaModel.create({
            titulo,
            descricao,
            dtInicio,
            dtFinal,
            idOrganizacao
        });

        if (!campanha) {
            throw new Error('Erro ao criar campanha');
        }

        if (metas.length > 0) {
            for (const meta of metas) {
                await MetaController.criar(
                    meta.meta,
                    campanha.idCampanha,
                    meta.idAlimento,
                    meta.idUnidadeMedida
                );
            }
        }

        return campanha;

    }

    async listarTodas(filtros = {}) {
        const { idOrganizacao, ativos } = filtros;

        if (idOrganizacao && !ativos) {
            throw new Error('Parâmetro inválido');
        }

        let whereClause = {
            ieSituacao: ativos === 'true' ? 'A' : 'I',
            idOrganizacao: idOrganizacao
        };

        if (idOrganizacao === '1' || idOrganizacao === undefined) {
            delete whereClause.idOrganizacao
        }

        const response = await CampanhaModel.findAll({
            where: whereClause,
            order: [['titulo', 'ASC']],
            include: [
                {
                    model: MetaModel,
                    as: 'metas',
                    include: [
                        {
                            model: AlimentoModel,
                            as: 'alimento',
                            attributes: ['idAlimento', 'alimento']
                        },
                        {
                            model: UnidadeMedidaModel,
                            as: 'unidade_medida',
                            attributes: ['idUnidadeMedida', 'dsUnidadeMedida']
                        }
                    ]
                }
            ]
        });

        const campanhas = [];

        for (const campanha of response) {
            const metas = [];

            for (const meta of campanha.metas) {
                const quantidadeEntrada = await buscarQuantidadeEntradaPorMeta(
                    campanha.idCampanha,
                    meta.idAlimento,
                    meta.idUnidadeMedida,
                    campanha.idOrganizacao
                );

                metas.push({
                    idMeta: meta.idMeta,
                    meta: meta.meta,
                    idAlimento: meta.idAlimento,
                    alimento: meta.alimento.alimento,
                    idUnidadeMedida: meta.idUnidadeMedida,
                    unidadeMedida: meta.unidade_medida.dsUnidadeMedida,
                    quantidadeDoada: quantidadeEntrada,
                    quantidadeFaltante: meta.meta - quantidadeEntrada,
                });
            }

            campanhas.push({
                idCampanha: campanha.idCampanha,
                titulo: campanha.titulo,
                descricao: campanha.descricao,
                dtInicio: campanha.dtInicio,
                dtFinal: campanha.dtFinal,
                ieSituacao: campanha.ieSituacao,
                metas
            });
        }

        return campanhas;
    }

    async editar(idCampanha, titulo, descricao, dtInicio, dtFinal, ieSituacao, metas = []) {
        const oldCampanha = await CampanhaModel.findByPk(idCampanha);

        if (!oldCampanha) {
            throw new Error('Campanha não encontrada');
        }


        const campanha = await CampanhaModel.update({
            titulo: titulo,
            descricao: descricao,
            dtInicio: dtInicio,
            dtFinal: dtFinal,
            ieSituacao: ieSituacao
        }, {
            where: { idCampanha }
        })

        if (!campanha) {
            throw new Error('Erro ao editar campanha');
        }

        const metasAtuais = await MetaController.buscarMetaPorCampanha(idCampanha);

        // Atualiza ou remove metas existentes
        for (const meta of metasAtuais) {
            const metaNova = metas.find(m => m.idMeta === meta.idMeta);

            if (metaNova) {
                // Atualiza meta existente
                await MetaController.editar(
                    meta.idMeta,
                    metaNova.meta,
                    idCampanha,
                    metaNova.idAlimento,
                    metaNova.idUnidadeMedida
                );
            } else {
                // Remove meta que não está mais na nova lista
                await MetaModel.destroy({ where: { idMeta: meta.idMeta } });
            }
        }

        // Cria novas metas (aquelas sem idMeta)
        for (const metaNova of metas) {
            if (!metaNova.idMeta) {
                await MetaController.criar(
                    metaNova.meta,
                    idCampanha,
                    metaNova.idAlimento,
                    metaNova.idUnidadeMedida
                );
            }
        }

        return campanha;

    }


}


module.exports = new CampanhaController();