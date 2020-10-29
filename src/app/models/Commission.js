const execSQLQuery = require('../../database/queryExecutor');
module.exports = class Commission {

    totalVendas;
    valorTotal;
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
            TGFCAB.DTNEG >= CONVERT(date, getdate())
            AND USUARIO.ID = ${this.user.id}`);
    }

    async findTotais(){
        return await execSQLQuery(`
        SELECT 
            COUNT(TGFCCM.NUNOTA) AS 'VENDAS',
            (SELECT FORMAT(SUM(ROUND((AD_VALOR_VENDA * PERCCOM) / 100,2)), 'c', 'pt-br')) AS 'VALOR'
        FROM TGFCCM 
        INNER JOIN USUARIO 
            ON TGFCCM.CODVEND = USUARIO.CODVEND
        INNER JOIN TGFCAB 
            ON TGFCCM.NUNOTA = TGFCAB.NUNOTA
         WHERE  
            TGFCAB.DTNEG >= CONVERT(date, getdate())
            AND USUARIO.ID = ${this.user.id}
        GROUP BY TGFCCM.AD_VALOR_VENDA,
            TGFCCM.PERCCOM`);
    }
}