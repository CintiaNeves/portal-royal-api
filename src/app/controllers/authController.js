const express = require('express');
const User = require('../models/User');
const Vendedor = require('../models/Vendedor');
const Commission = require('../models/Commission')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const sgMail = require('../../modules/sgMail');

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn : 1800,
    });
}

router.post('/register', async (req, res) =>{
    try{
        const user = new User(req);
        let result = await user.findOne('email', user.email);
        if(result.length > 0)
            return res.status(400).send({error: 'User already exists'});
        const vendedor = new Vendedor(user.cpf);
        let resultVendedor = await vendedor.findOne(); 

        if(resultVendedor.length === 0)
            return res.status(400).send({error: 'No seller for this cpf'});

        if(user.senha !== user.confSenha)
            return res.status(400).send({error: 'Passwords do not match'});
        
        user.codVend = resultVendedor[0].CODVEND;
        user.nome = resultVendedor[0].APELIDO;

        await user.create();
        result = await user.findOne('email', user.email);
        user.senha = undefined;
        user.confSenha = undefined;
        
        return res.send({
            user,
            token: generateToken({id: result[0].ID})
        });
    }catch(err){
        console.log(err);
        return res.status(400).send({error: err});
    }
});

router.get('/usuarios', async (req, res) =>{
    try{
        const user = new User(req);
        return res.send(await user.findAll());
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.post('/authenticate', async (req, res) =>{
    try{
        const user = new User(req);
        let result = await user.findOne('email', user.email);;

        if(result.length === 0)
            return res.status(400).send({error: 'User not found'});
        
        if(!await bcrypt.compare(user.senha, result[0].SENHA))
            return res.status(400).send({error: 'Invalid password'});

        user.senha = undefined;
    
        res.send({
            user, 
            token: generateToken({id: result[0].ID})
        });
    }catch(err){
        res.status(400).send({error: 'Failed on authenticate, try again'});
    }
    
});

router.post('/forgot_password', async (req, res) => {
    try{
        const user = new User(req);
        let result = await user.findOne('email', user.email);

        if(result.length === 0)
            return res.status(400).send({error: 'User not found'});

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        user.id = result[0].ID;
        user.token = token;
        user.dhExpires = now;

        await user.forgotPassword();

        sgMail.send({
            to: user.email,
            from: "noreply@royalcity.com.br",
            subject: "Recuperação de Senha - Royal City",
            text: "Você está recebendo este e-mail pois solicitou a troca da sua senha no Portal de comissões Royal. Use este token para alterar sua senha.",
            html: `<strong><p>Você está recebendo este e-mail pois solicitou a troca da sua senha no Portal de comissões Royal. Use este token para alterar sua senha. Token:  ${user.token}</p></strong>`,
        }, (err) => {
            if(err)
                return res.status(400).send({error: 'Cannot send on forgot password'})
            res.send();
        });

    }catch(err){
        
        res.status(400).send({error: 'Error on forgot password, try again'});
    }
});

router.post('/reset_password', async (req, res) =>{
    try{
        const user = new User(req);
        let result = await user.findOne('email', user.email);
        
        if(result.length === 0)
            return res.status(400).send({error: 'User not found'});

        if(user.senha !== user.confSenha)
            return res.status(400).send({error: 'Passwords do not match'});

        if(user.token !== result[0].TOKEN)
            return res.status(400).send({error: 'Token invalid'});

        const now = new Date();

        if(now.toLocaleString() > result[0].DHEXPIRES)
            return res.status(400).send({error: 'Token expired, generate a new one'});

        user.id = result[0].ID;
        await user.updatePassword();

        res.send();

    }catch(err){
        console.log(err);
        return res.status(400).send({error: 'Cannot reset password, try again'})
    }

});

router.get('/comissao', async (req, res) =>{
    try{
        const user = new User(req);
        const mes = 9;
        user.id = 1;
        const commission = new Commission(user);
        return res.send(await commission.find(mes));
    }catch(err){
        return res.status(400).send({error: err});
    }
});

module.exports = app => app.use('/auth', router);


