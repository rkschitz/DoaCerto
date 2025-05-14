const database = require("../config/database");

class MovimentacaoAlimento{
    constructor(){
        this.model = database.db.define("movimentacao_alimento",{
            idMovimentacaoAlimento:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            idMovimentacao:{
                type: database.db.Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: "movimentacao",
                    key: "idMovimentacao"
                }
            },
            idAlimento:{
                type: database.db.Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: "alimento",
                    key: "idAlimento"
                }
            },
            idUnidadeMedida:{
                type: database.db.Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: "unidade_medida",
                    key: "idUnidadeMedida"
                }
            },
            quantidade:{
                type: database.db.Sequelize.DECIMAL(10, 2),
                allowNull:false
            }
        },{
            freezeTableName: true
        })
    }
}

module.exports = new MovimentacaoAlimento().model;