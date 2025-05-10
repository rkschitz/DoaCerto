const database = require("../config/database");

class Endereco {
    constructor() {
        this.model = database.db.define("endereco", {
            idEndereco: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            idRua: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: "rua",
                    key: "idRua"
                },
            },
            complemento: {
                type: database.db.Sequelize.STRING,
            },
            numero: {
                type: database.db.Sequelize.STRING,
            },
        }, {
            freezeTableName: true
        });
    }
}

module.exports = new Endereco().model;