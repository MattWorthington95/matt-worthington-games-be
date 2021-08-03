const express = require('express')
const app = require('../app')
const { getCategories } = require('../controllers/contollers')

const categoriesRouter = express.Router()

categoriesRouter.get("/", getCategories)


module.exports = categoriesRouter