const config = require("./environment-config");
config.loadEnvironmentVariables();

module.exports = {
    local: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DB_HOST_LOCAL,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
};
