const sql = require('mssql');
const connStr = "Server=131.161.123.151,31433;Database=SANKHYA_TESTE;User Id=Sankhya;Password=*hv2018&;";

module.exports = sql.connect(connStr)
.then(conn => global.conn = conn)
.catch(err => console.log(err));





