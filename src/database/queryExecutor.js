
const conn = require('../database/index');


module.exports = async function execSQLQuery(sqlQry){
    try {
        const result = await global.conn.request().query(sqlQry);
        return result.recordset;     
    } catch(err) {
        console.log(err);
        res.json(err)
    }
}