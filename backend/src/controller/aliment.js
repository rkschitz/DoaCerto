const alimentModel = require("../model/alimento");

class AlimentController {
    async CriarAlimento(alimento, idUnidadeMedida){
        try {
            const novoAlimento = await alimentModel.create({
                alimento: alimento,
                idUnidadeMedida: idUnidadeMedida
            });
            return novoAlimento;
        } catch (error) {
            return error;
        }
    }

    async ListarAlimentos(){
        try {
            const alimentos = await alimentModel.findAll({});
            return alimentos;
        } catch (error) {
            return error;
        }
    }
}

module.exports = new AlimentController();