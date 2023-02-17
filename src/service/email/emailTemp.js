const fs = require("fs");
const logger = require("../../../logger/loggerIndex");
const Email = require("./email");

async function sendWelComeEmail(email){
try{
  const emailOptions = {
    to: email,
    from: "cpmindia@revoquant.com",
    subject: "Welcome",
    text:"Welcome to assignment"
  };
  const data = await Email.sendMail(emailOptions);
  return data;
}catch(error){
  return error
}
}

module.exports = {sendWelComeEmail}