const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
    constructor() {
        this.Init();
    }

    Init() {
        if (process.env.NODE_ENV === 'production') {
            this.db = new Sequelize(process.env.DATABASE_URL, {
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    }
                }
            });
        } else {
            this.db = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    dialect: 'postgres',
                }
            );
        }
    }
}

module.exports = new Database();
