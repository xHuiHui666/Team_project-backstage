const sql = require('mysql');
const db = sql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'jialiang',
    database: 'my_frist_sql'
})
module.exports = db;