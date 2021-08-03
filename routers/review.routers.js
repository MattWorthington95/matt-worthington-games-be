const express = require('express')
const app = require('../app')
const { getReviewById } = require('../controllers/contollers')
const reviewRouter = express.Router()

reviewRouter.use("/:review_id", getReviewById)

module.exports = reviewRouter