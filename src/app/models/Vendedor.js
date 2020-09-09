const execSQLQuery = require('../../database/queryExecutor');
module.exports = class User {

    codVend;
    constructor(cpf) {
        this.cpf = cpf;
    }

    async findOne(){
        return await execSQLQuery(`SELECT CODVEND, APELIDO FROM TGFVEN WHERE ATIVO = 'S' AND AD_CPFVEN = '${this.cpf}'`);
    }

}