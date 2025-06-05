const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
    constructor() {
        this.Init();
    }

    Init() {
        this.db = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                }
            }
        });
    }
}

module.exports = new Database();
