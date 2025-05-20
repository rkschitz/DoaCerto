const MovimentacaoModel = require("../model/movimentacao");
const MovimentacaoAlimentoModel = require("../model/movimentacaoAlimento");
const AlimentoModel = require('../model/alimento')
const UnidadeMedidaModel = require('../model/unidadeMedida')
const CampanhaModel = require('../model/campanha')
const PessoaModel = require('../model/pessoa')
const DonatarioModel = require('../model/donatario')
const { Op } = require("sequelize");

class MovimentacaoController {
  async criar(
    ieMovimentacao,
    idOrganizacao,
    idDoador,
    idDonatario,
    idCampanha,
    alimentos = [],
    dataMovimentacao
  ) {
    try {
      const response = await MovimentacaoModel.create({
        ieMovimentacao,
        idOrganizacao,
        idDoador,
        idDonatario,
        idCampanha,
        dataMovimentacao
      });

      if (response.dataValues) {
        for (const alimento of alimentos) {
          await MovimentacaoAlimentoModel.create({
            idMovimentacao: response.dataValues.idMovimentacao,
            idAlimento: alimento.idAlimento,
            idUnidadeMedida: alimento.idUnidadeMedida,
            quantidade: alimento.quantidade,
            dataValidade: alimento.dataValidade
          });
        }
      }
      return response;
    } catch (e) {
      return { mensagem: e };
    }
  }

  async listarMovimentacoes(idOrganizacao, filtros = {}) {
    const { idDonatario, ieMovimentacao } = filtros;

    let whereClause = {}

    if (idOrganizacao != 1) {
      whereClause.idOrganizacao = idOrganizacao
    };

    if (idDonatario) {
      whereClause.idDonatario = idDonatario;
    }

    if (ieMovimentacao) {
      whereClause.ieMovimentacao = ieMovimentacao;
    }

    const movimentacoes = await MovimentacaoModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: MovimentacaoAlimentoModel,
          as: "alimentos",
          attributes: ["quantidade", "idMovimentacaoAlimento", "dataValidade"],
          include: [{
            model: AlimentoModel,
            as: "alimento",
            attributes: ['idAlimento', 'alimento']
          }, {
            model: UnidadeMedidaModel,
            as: "unidade_medida",
            attributes: ['idUnidadeMedida', 'dsUnidadeMedida']
          }]
        }, {
          model: CampanhaModel,
          as: "campanha",
          attributes: ['idCampanha', 'titulo']
        }, {
          model: PessoaModel,
          as: "doador",
          attributes: ['nome']
        }, {
          model: DonatarioModel,
          as: "donatario",
          include: {
            model: PessoaModel,
            attributes: ['nome']
          }
        }
      ],
    });

    if (!movimentacoes.length) {
      return { sucesso: false, mensagem: "Nenhuma movimentação encontrada" };
    }

    const response = movimentacoes.flatMap((movimentacao) => {
      return movimentacao.alimentos.map((alimento) => ({
        idMovimentacao: movimentacao.idMovimentacao,
        ieMovimentacao: movimentacao.ieMovimentacao,
        idCampanha: movimentacao?.idCampanha,
        tituloCampanha: movimentacao?.campanha?.titulo,
        idDoador: movimentacao?.idDoador,
        nomeDoador: movimentacao?.doador?.nome,
        idDonatario: movimentacao?.idDonatario,
        nomeDonatario: movimentacao?.donatario?.pessoa?.nome,
        dataMovimentacao: movimentacao.dataMovimentacao,
        idMovimentacaoAlimento: alimento.idMovimentacaoAlimento,
        idAlimento: alimento.alimento.idAlimento,
        alimento: alimento.alimento.alimento,
        idUnidadeMedida: alimento.unidade_medida.idUnidadeMedida,
        unidadeMedida: alimento.unidade_medida.dsUnidadeMedida,
        quantidade: alimento.quantidade,
        dataValidade: alimento.dataValidade,
      }));
    });

    return { data: response, sucesso: true, mensagem: "Movimentações encontradas com sucesso" };
  }

  async excluir(idMovimentacao) {
    const movimentacao = await MovimentacaoModel.findOne({ where: { idMovimentacao } });

    if (!movimentacao) {
      return {
        message: 'Movimentação não encontrada',
        success: false,
      };
    }

    await MovimentacaoModel.destroy({ where: { idMovimentacao } });

    return { message: 'Movimentação excluída com sucesso' };
  }

  async editar(idMovimentacao, idCampanha, idDoador, idDonatario, dataMovimentacao, dataValidade, idUnidadeMedida, quantidade, idMovimentacaoAlimento) {

    const oldMovimentacao = await MovimentacaoModel.findOne({ where: { idMovimentacao } });

    if (!oldMovimentacao) {
      return {
        message: 'Movimentação não encontrada',
        success: false,
      };
    }

    const movimentacaoAlterar = {
      idCampanha: idCampanha || oldMovimentacao.idCampanha,
      idDoador: idDoador || oldMovimentacao.idDoador,
      idDonatario: idDonatario || oldMovimentacao.idDonatario,
      dataMovimentacao: dataMovimentacao || oldMovimentacao.dataMovimentacao
    }

    const movimentacao = await MovimentacaoModel.update(movimentacaoAlterar, {
      where: { idMovimentacao }
    });

    const alimentoAtualizado = await MovimentacaoAlimentoModel.update({
      idUnidadeMedida: idUnidadeMedida,
      quantidade: quantidade,
      dataValidade: dataValidade
    }, {
      where: {
        idMovimentacaoAlimento: idMovimentacaoAlimento
      }
    });
    return {
      message: 'Movimentação atualizada com sucesso',
      data: {
        movimentacao,
        alimentos: alimentoAtualizado
      }
    };
  }

  async buscarQuantidadeEntradaPorMeta(idCampanha, idAlimento, idUnidadeMedida, idOrganizacao) {

    const movimentacoes = await MovimentacaoModel.findAll({
      where: { idCampanha, 'ieMovimentacao': 'E', idOrganizacao },
      order: [['createdAt', 'DESC']],
      include:
      {
        model: MovimentacaoAlimentoModel,
        as: "alimentos",
        attributes: ["quantidade", "idMovimentacaoAlimento", "idAlimento", "idUnidadeMedida"],
        where: { idAlimento, idUnidadeMedida },
        required: true
      },
    });

    const totalQuantidade = movimentacoes.reduce((soma, mov) => {
      const somaAlimentos = mov?.alimentos.reduce((acc, alimento) => acc + Number(alimento.quantidade), 0);
      return soma + somaAlimentos;
    }, 0);

    return totalQuantidade;
  }

  async excluirMovimentacaoAlimento(idMovimentacaoAlimento) {
    const alimento = await MovimentacaoAlimentoModel.findOne({
      where: { idMovimentacaoAlimento: Number(idMovimentacaoAlimento) }
    });

    if (!alimento) {
      return {
        message: 'Alimento não encontrado',
        success: false,
      };
    }

    const idMovimentacao = alimento.idMovimentacao;

    const alimentos = await MovimentacaoAlimentoModel.findAll({
      where: { idMovimentacao }
    });

    if (alimentos.length === 1) {
      await MovimentacaoAlimentoModel.destroy({ where: { idMovimentacao } });
      await MovimentacaoModel.destroy({ where: { idMovimentacao } });

      return {
        message: 'Movimentação e alimento excluídos com sucesso (último alimento).',
        sucesso: true
      };
    } else {
      await MovimentacaoAlimentoModel.destroy({ where: { idMovimentacaoAlimento } });

      return {
        message: 'Alimento excluído com sucesso.',
        sucesso: true
      };
    }
  }


}

module.exports = new MovimentacaoController();
