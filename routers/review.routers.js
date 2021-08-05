const app = require('../app')
const { getReviewById, patchReviewById, getReviews, getCommentsByReviewId, postCommentByReviewId } = require('../controllers/contollers')
const reviews = require('../db/data/test-data/reviews')
const reviewRouter = require('express').Router()



reviewRouter.route("/:review_id")
    .get(getReviewById)
    .patch(patchReviewById)

reviewRouter.route("/")
    .get(getReviews)

reviewRouter.route("/:review_id/comments")
    .get(getCommentsByReviewId)
    .post(postCommentByReviewId)

module.exports = reviewRouter