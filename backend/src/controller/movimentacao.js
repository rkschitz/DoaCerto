const MovimentacaoModel = require("../model/movimentacao");
const MovimentacaoAlimentoModel = require("../model/movimentacaoAlimento");
const AlimentoModel = require('../model/alimento')
const UnidadeMedidaModel = require('../model/unidadeMedida')
const CampanhaModel = require('../model/campanha')
const PessoaModel = require('../model/pessoa')
const DonatarioModel = require('../model/donatario')

class MovimentacaoController {
  async criar(
    ieMovimentacao,
    idOrganizacao,
    idDoador,
    idDonatario,
    idCampanha,
    alimentos = []
  ) {
    try {
      const response = await MovimentacaoModel.create({
        ieMovimentacao,
        idOrganizacao,
        idDoador,
        idDonatario,
        idCampanha
      });

      if (response.dataValues) {
        for (const alimento of alimentos) {
          const alimentos = await MovimentacaoAlimentoModel.create({
            idMovimentacao: response.dataValues.idMovimentacao,
            idAlimento: alimento.idAlimento,
            idUnidadeMedida: alimento.idUnidadeMedida,
            quantidade: alimento.quantidade,
          });
          return alimentos;
        }
      }
      return response;
    } catch (e) {
      return { mensagem: e };
    }
  }

  async listarMovimentacoes(idOrganizacao) {
    const whereClause = idOrganizacao === 1
      ? { idOrganizacao: 1 }
      : { idOrganizacao: { [Op.not]: null } };

    const movimentacoes = await MovimentacaoModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: MovimentacaoAlimentoModel,
          as: "alimentos",
          attributes: ["quantidade", "idMovimentacaoAlimento"],
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

    if (!movimentacoes) {
      return { message: "Nenhuma movimentação encontrada" };
    }

    const response = movimentacoes.map((movimentacao) => {
      return {
        idMovimentacao: movimentacao.idMovimentacao,
        ieMovimentacao: movimentacao.ieMovimentacao,
        idCampanha: movimentacao?.idCampanha,
        tituloCampanha: movimentacao?.campanha?.titulo,
        idDoador: movimentacao?.idDoador,
        nomeDoador: movimentacao?.doador?.nome,
        idDonatario: movimentacao?.idDonatario,
        nomeDonatario: movimentacao?.donatario?.pessoa?.nome,
        dtMovimentacao: movimentacao.createdAt,
        alimentos: movimentacao.alimentos.map((alimento) => {
          return {
            idMovimentacaoAlimento: alimento.idMovimentacaoAlimento,
            idAlimento: alimento.alimento.idAlimento,
            alimento: alimento.alimento.alimento,
            idUnidadeMedida: alimento.unidade_medida.idUnidadeMedida,
            unidadeMedida: alimento.unidade_medida.dsUnidadeMedida,
            quantidade: alimento.quantidade
          };
        })
      };
    })

    return response;
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

  async editar(idMovimentacao, idCampanha, idDoador, idDonatario, alimentos = []) {

    const oldMovimentacao = await MovimentacaoModel.findOne({ idMovimentacao });

    if (!oldMovimentacao) {
      return {
        message: 'Movimentação não encontrada',
        success: false,
      };
    }

    const movimentacaoAlterar = {
      idCampanha: idCampanha || oldMovimentacao.idCampanha,
      idDoador: idDoador || oldMovimentacao.idDoador,
      idDonatario: idDonatario || oldMovimentacao.idDonatario
    }

    const movimentacao = await MovimentacaoModel.update(movimentacaoAlterar, {
      where: { idMovimentacao }
    });

    let alimentosAtualizados = [];
    await MovimentacaoAlimentoModel.destroy({
      where: { idMovimentacao }
    });

    for (const alimento of alimentos) {
      const alimentoCriado = await MovimentacaoAlimentoModel.create({
        idMovimentacao,
        idAlimento: alimento.idAlimento,
        idUnidadeMedida: alimento.idUnidadeMedida,
        quantidade: alimento.quantidade,
      });
      alimentosAtualizados.push(alimentoCriado);
    }

    return {
      message: 'Movimentação atualizada com sucesso',
      data: {
        movimentacao,
        alimentos: alimentosAtualizados
      }
    };
  }

  // async buscarMovimentacoesPorCampanha(idCampanha){
  //   const movimentacoes = await MovimentacaoModel.findAll({
  //     where: { idCampanha },
  //     order: [['createdAt', 'DESC']],
  //     include: [
  //       {
  //         model: MovimentacaoAlimentoModel,
  //         as: "alimentos",
  //         attributes: ["quantidade", "idMovimentacaoAlimento"],
  //         include: [{
  //           model: AlimentoModel,
  //           as: "alimento",
  //           attributes: ['idAlimento', 'alimento']
  //         }, {
  //           model: UnidadeMedidaModel,
  //           as: "unidade_medida",
  //           attributes: ['idUnidadeMedida', 'dsUnidadeMedida']
  //         }]
  //       }
  //     ],
  //   });

  //   return movimentacoes;
  // }

  async buscarQuantidadeEntradaPorMeta(idCampanha, idAlimento, idUnidadeMedida, idOrganizacao) {

    console.log("idCampanha", idCampanha, "idAlimento", idAlimento, "idUnidadeMedida", idUnidadeMedida, "idOrganizacao", idOrganizacao)

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

}

module.exports = new MovimentacaoController();
