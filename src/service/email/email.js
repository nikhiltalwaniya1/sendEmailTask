const nodemailer = require("nodemailer");
const fs = require("fs");
const logger = require("../../../logger/loggerIndex");

async function sendMail({ to, from, subject, text }) {
  try {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "junior.johnson@ethereal.email", // generated ethereal user
        pass: "N88PXsBkZksHbGnbKR", // generated ethereal password
      },
    })
    let info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text
    })
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    return error
  }
}

module.exports = { sendMail }