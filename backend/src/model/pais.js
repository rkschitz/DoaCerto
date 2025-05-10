const database = require("../config/database");

class Pais {
    constructor(){
        this.model = database.db.define("pais", {
            idPais:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            pais:{
                type: database.db.Sequelize.STRING,
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Pais().model;