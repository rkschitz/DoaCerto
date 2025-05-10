const database = require("../config/database");

class SituacaoHabitacional {
    constructor(){
        this.model = database.db.define("situacao_habitacional", {
            idSituacaoHabitacional:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            situacaoHabitacional:{
                type: database.db.Sequelize.STRING,
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new SituacaoHabitacional().model;