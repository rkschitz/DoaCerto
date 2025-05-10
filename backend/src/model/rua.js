const database = require("../config/database");

class Rua {
    constructor(){
        this.model = database.db.define("rua", {
            idRua:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            rua:{
                type: database.db.Sequelize.STRING,
            },
            CEP:{
                type: database.db.Sequelize.STRING,
            },
            idBairro:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'bairro',
                    key: 'idBairro'
                }
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Rua().model;