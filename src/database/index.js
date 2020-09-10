require('dotenv/config');
const sql = require('mssql');
const connStr = process.env.STRING_CONEXAO;

module.exports = sql.connect(connStr)
.then(conn => global.conn = conn)
.catch(err => console.log(err));





