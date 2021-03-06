const mysql = require('mysql2');
const connection = mysql.createPool({
    host: 'twocent.icu',
    user: 'test',
    password: 'test',
    database: 'cameraHub'
});

/*
connection.connect(function (err) {
    if (err) throw err;
});
*/

module.exports = connection;