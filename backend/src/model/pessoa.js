const database = require("../config/database.js");
class Pessoa {
    constructor() {
        this.model = database.db.define("pessoa", {
            idPessoa: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            cpf: {
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            telefone: {
                type: database.db.Sequelize.STRING,
            },
            email: {
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            dtNascimento: {
                type: database.db.Sequelize.DATE,
            },
            sexo: {
                type: database.db.Sequelize.STRING,
            },
            idEndereco: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'endereco',
                    as: 'endereco',
                    key: 'idEndereco'
                }
            },
        }, {
            freezeTableName: true
        });
    }
}

module.exports = new Pessoa().model;