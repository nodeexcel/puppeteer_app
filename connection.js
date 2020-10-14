const mysql = require("mysql");
require('dotenv').config()

let pool = mysql.createPool(
    {
        connectionLimit: process.env.connectionLimit,
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        // debug: process.env.debug,
        multipleStatements: process.env.multipleStatements,
    }
);

getConnection = function (callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        callback(err, conn);
    });
};

module.exports = {
    getConnection: getConnection,
    pool: pool
}