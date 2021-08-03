const express = require('express')
const app = require('../app')
const categoriesRouter = require('./categories.router')
const reviewRouter = require('./review.routers')
const apiRouter = express.Router()

apiRouter.use("/categories", categoriesRouter)
apiRouter.use("/reviews", reviewRouter)

module.exports = apiRouter

