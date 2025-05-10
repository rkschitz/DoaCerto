const MovimentacaoModel = require("../model/movimentacao");
const movimentacaoAlimentoModel = require("../model/movimentacaoAlimento");
const alimentoModel = require('../model/alimento')
const unidadeMedidaModel = require('../model/unidadeMedida')
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

      console.log('chegou aqui criou movimentação', response)

      if (response.dataValues) {
        for (const alimento of alimentos) {
          const alimentos = await movimentacaoAlimentoModel.create({
            idMovimentacao: response.dataValues.idMovimentacao,
            idAlimento: alimento.idAlimento,
            idUnidadeMedida: alimento.idUnidadeMedida,
            quantidade: alimento.quantidade,
          });
          console.log('chegou aqui criou alimento')
          return alimentos;
        }
      }
      return response;
    } catch (e) {
      console.log(e)
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
          model: movimentacaoAlimentoModel,
          as: "alimentos",
          attributes: ["quantidade", "idMovimentacaoAlimento"],
          include: [{
            model: alimentoModel,
            as: "alimento",
            attributes: ['idAlimento', 'alimento']
          }, {
            model: unidadeMedidaModel,
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

  async editar(idMovimentacao, idOrganizacao, idCampanha, idDoador, idDonatario, alimentos = []) {
    try {

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
        idDonatario: idDonatario || oldMovimentacao.idDonatario,
        idOrganizacao: idOrganizacao || oldMovimentacao.idOrganizacao,
      }

      const movimentacao = await MovimentacaoModel.update(movimentacaoAlterar, {
        where: { idMovimentacao }
      });

      let alimentosAtualizados = [];
      if (alimentos.length > 0) {
        await movimentacaoAlimentoModel.destroy({
          where: { idMovimentacao }
        });

        for (const alimento of alimentos) {
          const alimentoCriado = await movimentacaoAlimentoModel.create({
            idMovimentacao,
            idAlimento: alimento.idAlimento,
            idUnidadeMedida: alimento.idUnidadeMedida,
            quantidade: alimento.quantidade,
          });
          alimentosAtualizados.push(alimentoCriado);
        }
      } else {
        alimentosAtualizados = await movimentacaoAlimentoModel.findAll({
          where: { idMovimentacao }
        });
      }

      return {
        message: 'Movimentação atualizada com sucesso',
        success: true,
        data: {
          movimentacao,
          alimentos: alimentosAtualizados
        }
      };
    } catch (e) {
      console.log(e)
      return {
        message: 'Erro ao atualizar movimentação',
        success: false,
        error: e.message
      };
    }
  }

}

module.exports = new MovimentacaoController();
