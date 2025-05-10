const database = require("../config/database");

class Organizacao {
    constructor(){
        this.model = database.db.define("organizacao", {
            idOrganizacao:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            organizacao:{
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            cnpj:{
                type: database.db.Sequelize.STRING,
            },
            telefone:{
                type: database.db.Sequelize.STRING,
            },
            email:{
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            senha:{
                type: database.db.Sequelize.STRING,
            },
            role:{
                type: database.db.Sequelize.STRING,
                defaultValue: 'O'
            },
            ieSituacao:{
                type: database.db.Sequelize.STRING,
            },
            idSecretaria:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: "pessoa",
                    key: "idPessoa"
                }
            },
            idEndereco:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'endereco',
                    key: 'idEndereco'
                }
            }
            
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Organizacao().model;