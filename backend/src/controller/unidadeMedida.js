const unidadeMedidaModel = require("../model/unidadeMedida")

class UnidadeMedidaController {

  async criar(dsUnidadeMedida) {
    const response = await unidadeMedidaModel.create({
      dsUnidadeMedida,
    });
    return response;
  }

  async buscarTodos() {
    const response = await unidadeMedidaModel.findAll();
    return response;
  }
}

module.exports = new UnidadeMedidaController();