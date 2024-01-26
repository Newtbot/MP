const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
//.env

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false, 
    auth: {
      user: process.env.euser,
      pass: process.env.epass
    },
  });
module.exports = { transporter };