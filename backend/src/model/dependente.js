const database = require("../config/database.js");

class Dependente{
    constructor(){
        this.model = database.db.define("dependente", {
            idDependente:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            idPessoa:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'pessoa',
                    key: 'idPessoa'
                },
            },
            idProvedor:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'donatario',
                    key: 'idDonatario'
                },
            },
            idGrauParentesco:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'grau_parentesco',
                    key: 'idGrauParentesco'
                },
            },

        },{
            freezeTableName: true
        });
    }
}

module.exports = new Dependente().model;