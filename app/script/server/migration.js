const mysql = require('mysql');
const migration = require('mysql-migrations');
const path = require('path');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'cbf',
});

migration.init(connection, path.join(__dirname, 'migrations'));
