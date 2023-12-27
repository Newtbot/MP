const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, // use the appropriate port for your SMTP server
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.euser,
      pass: process.env.epass
    },
  });


module.exports = { transporter } ; 