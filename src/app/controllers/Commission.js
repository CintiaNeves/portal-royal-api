const express = require('express');
const authMiddleware = require('../middleware/auth');
const Commission = require('../models/Commission');
const User = require('../models/User');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) =>{
    try{
        const user = new User(req);
        user.id = req.userId;
        const commission = new Commission(user);
        return res.send(await commission.findAll());
    }catch(err){
        return res.status(400).send({error: err});
    }  
});

router.get('/totais', async (req, res) =>{
    try{
        const user = new User(req);
        user.id = req.userId;
        const commission = new Commission(user);
        return res.send(await commission.findTotais());
    }catch(err){
        return res.status(400).send({error: err});
    }  
});

module.exports = app => app.use('/commission', router);