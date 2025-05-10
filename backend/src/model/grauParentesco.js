const database = require("../config/database");

class GrauParentesco {
    constructor(){
        this.model = database.db.define("grau_parentesco", {
            idGrauParentesco:{
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            grauParentesco:{
                type: database.db.Sequelize.STRING,
            },
        },{
            freezeTableName: true
        });
    }
}

module.exports = new GrauParentesco().model;