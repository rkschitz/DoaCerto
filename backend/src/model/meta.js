const database = require("../config/database");

class Meta {
    constructor() {
        this.model = database.db.define("meta", {
            idMeta: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            meta: {
                type: database.db.Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            idCampanha: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'campanha',
                    as: 'campanha',
                    key: 'idCampanha'
                },
                allowNull: false,
            },
            idAlimento: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'alimento',
                    as: 'alimento',
                    key: 'idAlimento'
                },
                allowNull: false,
            },
            idUnidadeMedida: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'unidade_medida',
                    as: 'unidade_medida',
                    key: 'idUnidadeMedida'
                },
                allowNull: false,
            }
        }, {
            freezeTableName: true
        });
    }
}

module.exports = new Meta().model;