const execSQLQuery = require('../../database/queryExecutor');
module.exports = class Commission {
    
    constructor(user) {
        this.user = user;  
    }

    async findAll(){
        return await execSQLQuery(`
        SELECT 
            CONVERT(VARCHAR, TGFCAB.DTNEG, 103) AS 'DATA', 
            TGFCCM.CODVEND,
            USUARIO.NOME,
            TGFCCM.NUNOTA,
            TGFCCM.OBS AS 'TIPO',
            CONCAT(PERCCOM, '%') AS PERCCOM,
            FORMAT(ROUND((AD_VALOR_VENDA * PERCCOM) / 100,2), 'c', 'pt-br') AS 'VALOR'
        FROM TGFCCM 
        INNER JOIN USUARIO 
            ON TGFCCM.CODVEND = USUARIO.CODVEND
        INNER JOIN TGFCAB 
            ON TGFCCM.NUNOTA = TGFCAB.NUNOTA
        WHERE  
            USUARIO.ID = ${this.user.id}`);
    }
}