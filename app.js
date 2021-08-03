const express = require('express')
const { handleRouter404s, handleCustomErrors } = require('./errors')
const apiRouter = require('./routers/api.routers')

const app = express()

app.use("/api", apiRouter)

app.use(handleRouter404s)
app.use(handleCustomErrors)

module.exports = app