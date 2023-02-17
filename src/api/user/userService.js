const User = require('../../models/user')

module.exports.chackUserData = async (userEmail)=>{
  try{
    const userData = await User.findOne({email:userEmail}).lean()
    return userData
  }catch(error){
    return error
  }
}