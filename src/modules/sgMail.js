const sgMail = require('@sendgrid/mail');
require('dotenv/config');

sgMail.setApiKey(process.env.SGMAIL_API_KEY);

module.exports = sgMail;