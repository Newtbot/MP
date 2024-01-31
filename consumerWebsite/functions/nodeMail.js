const { transporter } = require("../modules/nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/*
var message = {
  from: "sender@server.com",
  to: "receiver@sender.com",
  subject: "Message title",
  text: "Plaintext version of the message",
  html: "<p>HTML version of the message</p>",
};
//send mail with defined transport object
transporter.sendMail(data[, callback])

*/

async function sendContactEmail(email, name, message) {
    console.log(email, name, message);

	try {
		let contactMessage = await transporter.sendMail({
            to: process.env.euser,
            subject: "Contact us Message",
            html: `
                <h1>Contact us Message</h1>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>User Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p>Thank you for contacting us. We will get back to you as soon as possible.</p>
                <p>Regards,</p>
                <p>EcoSaver Team</p>
                <p><a href="https://ecosaver.teeseng.uk/">EcoSaver Website</a></p>
                <p>Please do not reply to this email.</p>
            `,
		});
        transporter.sendMail({ contactMessage }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
	} catch (error) {
		console.error(error);
	}
}

async function sendTokenEmail(email, token) {

    try {
        let tokenMessage = await transporter.sendMail({
            to: email,
            from: process.env.euser,
            subject: "API Token",
            html: `
                <h1>API Token</h1>
                <p><strong>Token:</strong> ${token}</p>
                <p>Please do not lose this token and do not share your token with anyone!</p>
                <p>Thank you for using EcoSaver.</p>
                <p>Regards,</p>
                <p>EcoSaver Team</p>
                <p><a href="https://ecosaver.teeseng.uk/">EcoSaver Website</a></p>
                <p>Please do not reply to this email.</p>
            `,
        });
        transporter.sendMail({ tokenMessage }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function sendResetPasswordEmail(email, resetToken) {
	try {
		let resetMessage = await transporter.sendMail({
            to: email,
            from: process.env.euser,
            subject: "Reset Password",
            html: `
                <h1>Reset Password</h1>
                <p><strong>Reset Password Link:</strong> <a href="https://ecosaver.teeseng.uk/resetpassword/${resetToken}">Reset Password Link </p>
                <p><strong>From:</strong> Eco Saver</p>
                <p>Kindly click on the link to reset your password!</p>
                <p>Regards,</p>
                <p>EcoSaver Team</p>
                <p><a href="https://ecosaver.teeseng.uk/">EcoSaver Website</a></p>
                <p>Please do not reply to this email.</p>
            `,
		});
        transporter.sendMail({ resetMessage }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
	} catch (error) {
		console.error(error);
	}
}

module.exports = { sendContactEmail , sendTokenEmail, sendResetPasswordEmail };
