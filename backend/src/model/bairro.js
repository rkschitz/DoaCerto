const database = require("../config/database");

class Bairro {
    constructor() {
        this.model = database.db.define("bairro", {
            idBairro: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            bairro:{
                type: database.db.Sequelize.STRING,
            },
            idCidade: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'cidade',
                    key: 'idCidade'
                }
            },
        }, {
            freezeTableName: true
        });
    }
}

module.exports = new Bairro().model;