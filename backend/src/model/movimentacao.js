const database = require("../config/database");

class Movimentacao {
    constructor() {
        this.model = database.db.define("movimentacao", {
            idMovimentacao: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            ieMovimentacao: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            idOrganizacao: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: "organizacao",
                    key: "idOrganizacao"
                }
            },
            idDoador: {
                type: database.db.Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "pessoa",
                    key: "idPessoa"
                }
            },
            idDonatario: {
                type: database.db.Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "donatario",
                    key: "idDonatario"
                }
            },
            idCampanha: {
                type: database.db.Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "campanha",
                    key: "idCampanha"
                }
            },
            dataMovimentacao: {
                type: database.db.Sequelize.DATE,
                allowNull: false
            }
        }, {
            freezeTableName: true
        })
    }
}

module.exports = new Movimentacao().model