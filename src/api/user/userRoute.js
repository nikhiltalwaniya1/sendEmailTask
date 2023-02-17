const express = require('express')
const router = express.Router()
const db = require('../../models/connection')
const usercontroller = require('./userController')
const utlis = require("../../service/utils")

router.get('/', (err, res) => {
  res.send({
    status: 1,
    message: "Working"
  })
})

router.post("/createUser", usercontroller.createUser)
router.get("/getCSVlist/:perPage/:limit", utlis.checkToken, usercontroller.getCSVlistBYID)
router.post("/importCSV/:userId", utlis.checkToken, usercontroller.importCSV)
router.post("/sendEmail", usercontroller.sendEmail)
module.exports = router