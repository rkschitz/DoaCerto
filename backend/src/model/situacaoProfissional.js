const database = require("../config/database");

class SituacaoProfissional{
    constructor(){
        this.model = database.db.define("situacao_profissional", {
            idSituacaoProfissional:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            situacaoProfissional:{
                type: database.db.Sequelize.STRING,
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new SituacaoProfissional().model;