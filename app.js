const express = require('express')
const app = express()
const userRouter = require('./src/api/user/userRoute')
var bodyParser = require('body-parser')
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-api.json");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/uploadCSV-api",swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/", userRouter)

app.listen('243', ()=>{
  console.log('server started')
})