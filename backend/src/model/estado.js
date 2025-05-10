const database = require("../config/database");

class Estado {
    constructor(){
        this.model = database.db.define("estado", {
            idEstado:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            estado:{
                type: database.db.Sequelize.STRING,
            },
            idPais:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'pais',
                    key: 'idPais'
                }
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Estado().model;