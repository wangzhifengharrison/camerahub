const mysql = require('mysql2');
const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'synergy'
});

/*
connection.connect(function (err) {
    if (err) throw err;
});
*/

module.exports = connection;
