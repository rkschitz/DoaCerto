const GrauParentescoModel = require('../model/grauParentesco.js')
class GrauParentescoController{
    async criar(grauParentesco){
        try{
            const grauParentescoValue = await GrauParentescoModel.create(grauParentesco)
            return grauParentescoValue
        }catch(e){
            return {mensagem: e.message}
        }
    }

    async buscarTodos(){
        try{
            const grauParentescoValue = await GrauParentescoModel.findAll()
            return grauParentescoValue
        }catch(e){
            return {mensagem: e.message}
        }
    }
}

module.exports = new GrauParentescoController()