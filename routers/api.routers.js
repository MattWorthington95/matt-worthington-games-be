const app = require('../app')
const { getEndPoints } = require('../controllers/contollers')
const categoriesRouter = require('./categories.router')
const reviewRouter = require('./review.routers')
const apiRouter = require('express').Router()

apiRouter.get("/", getEndPoints)
apiRouter.use("/categories", categoriesRouter)
apiRouter.use("/reviews", reviewRouter)

module.exports = apiRouter

