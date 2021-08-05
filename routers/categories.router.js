const app = require('../app')
const { getCategories } = require('../controllers/contollers')
const categoriesRouter = require('express').Router()

categoriesRouter.route("/")
    .get(getCategories)


module.exports = categoriesRouter