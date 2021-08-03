const express = require('express')
const apiRouter = require('./routers/api.routers')

const app = express()

app.use("/api", apiRouter)

module.exports = app