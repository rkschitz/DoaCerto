const database = require("../config/database");

class Donatario {
    constructor() {
        this.model = database.db.define("donatario", {
            idDonatario: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            idPessoa: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'pessoa',
                    as: 'pessoa',
                    key: 'idPessoa'
                }
            },
            idSituacaoHabitacional: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'situacao_habitacional',
                    key: 'idSituacaoHabitacional'
                }
            },
            tempoResidencia: {
                type: database.db.Sequelize.INTEGER,
            },
            rendaFamiliar: {
                type: database.db.Sequelize.DECIMAL(10, 2),
            },
            idSituacaoProfissional: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'situacao_profissional',
                    key: 'idSituacaoProfissional'
                }
            },
            cadastroCras: {
                type: database.db.Sequelize.STRING
            },
            outroLocal: {
                type: database.db.Sequelize.STRING
            },
            enfermoNaCasa: {
                type: database.db.Sequelize.STRING
            },
            situacaoEnfermo:{
                type: database.db.Sequelize.STRING
            },
            dataCadastro:{
                type: database.db.Sequelize.DATE,
                defaultValue: database.db.Sequelize.NOW
            },
            idOrganizacao: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'organizacao',
                    key: 'idOrganizacao'
                }
            },
            responsavelVisita:{
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'pessoa',
                    as:'responsavelVisita',
                    key: 'idPessoa'
                }
            },
            ieSituacao:{
                type: database.db.Sequelize.STRING,
                defaultValue: 'A' // A Ativo I Inativo
            },
            situacaoCadastral:{
                type: database.db.Sequelize.STRING,
                defaultValue: 'P' // Pendente Aprovado Reprovado
            },
            observacao:{
                type: database.db.Sequelize.STRING,
            },
            dtEntregaCesta:{
                type: database.db.Sequelize.DATE,
            },
            nacionalidade:{
                type: database.db.Sequelize.STRING,
            }
        }, {
            freezeTableName: true
        });
    }
}

module.exports = new Donatario().model;