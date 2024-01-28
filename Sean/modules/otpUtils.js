const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const generateOTP = () => {
	const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
	const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
	return { otp, expirationTime };
  };
const sendOTPByEmail = async (email, otp) => {
	try {
	  const transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
        port: 587, // use the appropriate port for your SMTP server
        secure: false, // true for 465, false for other ports
		auth: {
		  user: process.env.euser,  // replace with your email
		  pass: process.env.epass   // replace with your email password
		}
	  });
  
	  const mailOptions = {
		from: process.env.euser,
		to: email,
		subject: 'Login OTP',
		text: `Your OTP for login is: ${otp}`
	  };
  
	  await transporter.sendMail(mailOptions);
	  console.log('OTP sent successfully to', email);
	} catch (error) {
	  console.error('Error sending OTP:', error);
	  throw error;
	}
  };

  module.exports = {
    generateOTP,
    sendOTPByEmail
  };



  