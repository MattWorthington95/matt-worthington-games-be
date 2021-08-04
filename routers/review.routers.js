const express = require('express')
const app = require('../app')
const { getReviewById, patchReviewById } = require('../controllers/contollers')
const reviewRouter = express.Router()

reviewRouter.get("/:review_id", getReviewById)
reviewRouter.patch("/:review_id", patchReviewById)



module.exports = reviewRouter