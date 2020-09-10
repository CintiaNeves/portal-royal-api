require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();    

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(cors());

require('./app/controllers/index')(app);

const port = process.env.PORT || 3000;

app.listen(port);




