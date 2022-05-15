const mysql = require('mysql2');
const connection = mysql.createPool({
    host: '3.25.122.121',
    user: 'root',
    password: 'wang0.25',
    database: 'synergy'
});

/*
connection.connect(function (err) {
    if (err) throw err;
});
*/

module.exports = connection;
