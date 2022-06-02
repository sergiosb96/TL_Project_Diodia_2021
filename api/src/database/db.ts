// Use the MariaDB Node.js Connector
const mariadb = require('mariadb');

// Create a connection pool
const pool =
    mariadb.createPool({
        // host: "83.212.102.64",
        host: 'localhost',
        port: 3307,
        user: "ntua",
        password: "ntua123!",
        database: "ntua"
    });

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
    pool: pool
});
