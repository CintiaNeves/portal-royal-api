const execSQLQuery = require('../../database/queryExecutor');
const bcrypt = require('bcryptjs');

module.exports = class User {

    id;
    dhExpires;
    nome;
    constructor(req) {
        if(!req.route.methods.get){
            if(req.body.email != undefined)
                this.email = req.body.email.substring(0,150);
            if(req.body.senha != undefined)
                this.senha = req.body.senha.substring(0,11);
            if(req.body.confSenha != undefined)
                this.confSenha = req.body.confSenha.substring(0,11);
            if(req.body.cpf != undefined)
                this.cpf = req.body.cpf.substring(0,11);
            if(req.body.token != undefined)
                this.token = req.body.token.trim();
           
        }
    }

    async create(){
        const hash = await this.encrypt(this.senha);
        await execSQLQuery(`INSERT INTO USUARIO (NOME, CPF, SENHA, EMAIL, CODVEND) VALUES ('${this.nome}','${this.cpf}','${hash}','${this.email}', ${this.codVend})`);
    }

    async encrypt(senha){
        const hash = await bcrypt.hash(senha, 10);
        return hash;
    }

    async findOne(campo, valor){
        return await execSQLQuery(`SELECT * FROM USUARIO WHERE ${campo} = '${valor}'`);
    }

    findAll(){
        return execSQLQuery('SELECT ID, NOME, CPF FROM USUARIO');
    }

    update(){
        execSQLQuery(`UPDATE USUARIO SET NOME = '${this.nome}', EMAIL = '${this.email}', 
            CPF = '${this.cpf}', SENHA = '${this.senha}', TOKEN = '${this.token}', 
         DHEXPIRES = '${this.dhExpires}' WHERE ID = ${this.id}`);
    }

    async forgotPassword(){
        return await execSQLQuery(`UPDATE USUARIO SET TOKEN = '${this.token}' WHERE ID = ${this.id}`);
    }

    async updatePassword(){
        const now = new Date();
        const hash = await this.encrypt(this.senha);
        return await execSQLQuery(`UPDATE USUARIO SET SENHA = '${hash}'  WHERE ID = ${this.id}`);
    }
}

