const database = require("../config/database");

class Campanha {
    constructor(){
        this.model = database.db.define("campanha", {
            idCampanha:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            titulo: {
                type: database.db.Sequelize.STRING,
            },
            descricao: {
                type: database.db.Sequelize.STRING,
            },
            dtInicio: {
                type: database.db.Sequelize.DATE,
            },
            dtFinal: {
                type: database.db.Sequelize.DATE,
            },
            ieSituacao: {
                type: database.db.Sequelize.STRING, //Podendo ser F = Finalizada, A = Ativa, I = Inativa
                defaultValue: 'A'
            },
            idOrganizacao:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'organizacao',
                    key: 'idOrganizacao'
                }
            }
        },{
            freezeTableName: true
        });
    }
}

module.exports = new Campanha().model;