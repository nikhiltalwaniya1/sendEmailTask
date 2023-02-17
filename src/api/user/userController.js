const express = require('express')
const User = require('../../models/user')
var jwt = require('jsonwebtoken');
const userService = require('./userService')
const utils = require("../../service/utils")
const csvtojson = require("csvtojson");
const userResponse = require("../../response/userResponse")
const ContactDetails = require("../../models/contactDetails")
const contractDetailsResponse = require("../../response/contactDetailsResponse");
const logger = require('../../../logger/loggerIndex');
const emailTemp = require("../../service/email/emailTemp")


module.exports.createUser = async (req, res, next) => {
  try {
    const userEmail = req.body.email
    const password = req.body.password
    const userData = await userService.chackUserData(userEmail)
    if (userData) {
      const comparePassword = await utils.comparePassword(userData.password, password)
      if (comparePassword) {
        const id = await utils.encyptId(userData._id)
        userData.id = id
        const token = await utils.createToken(userData)
        userData.token = token
        return res.send({
          status: 1,
          message: 'Success',
          data: new userResponse(userData)
        })
      } else {
        return res.send({
          status: 0,
          message: 'Password not match'
        })
      }
    } else {
      const encryptPassword = await utils.encryptPassword(password)
      const saveUserDetails = new User({
        email: userEmail,
        password: encryptPassword
      })
      const newUser = saveUserDetails.toObject();
      const token = await utils.createToken(newUser)
      const userData = await saveUserDetails.save()
      const id = await utils.encyptId(userData._id)
      let objOfUser = {
        id:id,
        email:userData.email,
        token:token
      }
      return res.send({
        status: 1,
        message: 'Success',
        data: new userResponse(objOfUser)
      })
    }
  } catch (error) {
    console.log("error========", error)
    return res.send({
      status: 0,
      message: error.message
    })
  }
}

module.exports.getCSVlistBYID = async (req, res, next)=>{
  try{
    let perPage = req.params?.perPage ? req.params.perPage : 10;
    let page = req.params?.page ? req.params.page : 1;
    let pageNo = page ? (page - 1) * perPage : 0;
    const userId = req.decoded._id
    const emailList = await ContactDetails.find({createdBy:userId}).limit(perPage).skip(pageNo).sort({ createdAt: -1 }).lean()
    const listPromise = await emailList.map(async (emailValue)=>{
      emailValue.id = await utils.encyptId(emailValue._id)
      const emailRes =  new contractDetailsResponse(emailValue)
      return emailRes
    })
    const finalEmailList = await Promise.all(listPromise)
    return res.send({
      status: 1,
      message: "Success",
      data: finalEmailList
    })
  }catch(error){
    logger.info("error==userController= line 85=="+ error)
    return res.send({
      status: 0,
      message: error.message
    })
  }
}

module.exports.importCSV = async(req, res, next)=>{
  try{
    const multipartyDataNew = await utils.multipartyData(req)
    if (multipartyDataNew && multipartyDataNew.file.length == 0) {
      return res.send({
        status: 0,
        message: "Invalid file",
      });
    }
    const checkEmailObj = {
      Email: "",
    };
    const fileCsv = multipartyDataNew.file[0];
    const source = await csvtojson().fromFile(fileCsv.path);
    if(source.length > 0){
      let sourceKeys = Object.keys(source[0]).sort();
      let ObjKeys = Object.keys(checkEmailObj).sort();
      let finalList = [];
      let emails = [];
      if(JSON.stringify(sourceKeys) === JSON.stringify(ObjKeys)){
        for (var i = 0; i < source.length; i++) {
          let email = source[i]["Email"]
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            emails.push(email)
          }else{
            logger.info("Error Email Values==   "+ `${email}` + "User Id " + `${req.decoded._id}` + "User Email :" + `${req.decoded.email}`)
          }
        }
        finalList = await utils.removeDuplicateValueInArray(emails)
      }
      if(finalList.length > 0){
        const promise = await finalList.map(async (valofEmail)=>{
          const saveEmail = new ContactDetails({
            email:valofEmail,
            createdBy:req.decoded._id
          })
          await saveEmail.save()
        })
        await Promise.all(promise)
        return res.send({
          status: 1,
          message: "Success"
        })
      }
    }
  }catch(error){
    return res.send({
      status: 0,
      message: error.message
    })
  }
}

module.exports.sendEmail = async(req, res, next)=>{
  try{
    const emailList = req.body.sendEmails
    const promise = await emailList.map(async(valueOfEmail)=>{
      const sendWelcomeEmail = await emailTemp.sendWelComeEmail(valueOfEmail)
    })
    await Promise.all(promise)
    return res.send({
      status: 1,
      message: "Email Sended"
    })
  }catch(error){
    return res.send({
      status: 0,
      message: error.message
    })
  }
}