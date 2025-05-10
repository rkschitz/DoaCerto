const database = require("../config/database");

class TipoAlimento {
    constructor(){
        this.model = database.db.define("tipo_alimento", {
            idTipoAlimento:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tipoAlimento:{
                type: database.db.Sequelize.STRING,
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new TipoAlimento().model;