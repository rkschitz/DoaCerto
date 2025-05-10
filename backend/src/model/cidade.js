const database = require("../config/database");

class Cidade {
    constructor(){
        this.model = database.db.define("cidade", {
            idCidade:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            cidade:{
                type: database.db.Sequelize.STRING,
            },
            idEstado:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'estado',
                    key: 'idEstado'
                }
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Cidade().model;