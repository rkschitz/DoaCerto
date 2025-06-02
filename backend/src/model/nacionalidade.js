const database = require("../config/database");

class Nacionalidade {
    constructor() {
        this.model = database.db.define("nacionalidade", {
            idNacionalidade: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nacionalidade: {
                type: database.db.Sequelize.STRING,
            },
        }, {
            freezeTableName: true
        });
    }
}

module.exports = new Nacionalidade().model;