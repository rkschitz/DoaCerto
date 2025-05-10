const database = require("../config/database");

class Alimento {
    constructor(){
        this.model = database.db.define("alimento", {
            idAlimento:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            alimento:{
                type: database.db.Sequelize.STRING,
            },
            idTipoAlimento:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'tipo_alimento',
                    key: 'idTipoAlimento'
                }
            },	
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Alimento().model;