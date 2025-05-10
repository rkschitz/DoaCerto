// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
    constructor() {
        this.db = new Sequelize({
            database: "doacerto",
            host: "localhost",
            username: "root",
            dialect: "mysql",
            password: "",
        });
    }
}

const database = new Database();

// Exporta diretamente a instância de Sequelize
module.exports = {
    db: database.db,     // alias claro
    sequelize: database.db, // alias para quem quiser chamar de 'sequelize'
    Sequelize             // útil para importar DataTypes, etc.
};
