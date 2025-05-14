const CampanhaModel = require('../model/campanha');
const MetaModel = require('../model/meta');
const AlimentoModel = require('../model/alimento');
const UnidadeMedidaModel = require('../model/unidadeMedida');
const { buscarQuantidadeEntradaPorMeta } = require('./movimentacao');

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

    async listarTodas(idOrganizacao, ativos) {
        if (idOrganizacao && !ativos) {
            throw new Error('Parâmetro inválido');
        }

        let parametros = { ieSituacao: null };
        if (idOrganizacao != 1 || !idOrganizacao) {
            parametros.idOrganizacao = idOrganizacao;
        }

        ativos === 'true' ? parametros.ieSituacao = 'A' : parametros.ieSituacao = 'I';

        const response = await CampanhaModel.findAll({
            where: parametros,
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
}


module.exports = new CampanhaController();