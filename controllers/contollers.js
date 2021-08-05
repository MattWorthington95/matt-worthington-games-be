const { selectCategories, selectReviewById, updateReviewById, selectReview } = require("../models/models");

const getCategories = async (req, res) => {
    const categories = await selectCategories()
    res.status(200).send({ categories })
}

const getReviewById = async (req, res, next) => {
    try {
        const { review_id } = req.params
        const review = await selectReviewById(review_id)
        res.status(200).send({ review })
    } catch (err) {
        next(err)
    }
}
const patchReviewById = async (req, res, next) => {
    try {
        const { inc_votes } = req.body
        const { review_id } = req.params
        const updatedReview = await updateReviewById(review_id, inc_votes)
        res.status(201).send({ updatedReview })
    } catch (err) {
        next(err)
    }
}

const getReviews = async (req, res, next) => {
    try {
        let { sort_by, order, category } = req.query
        if (order) order = order.toUpperCase()
        const reviews = await selectReview(sort_by, order, category)
        res.status(200).send({ reviews })
    } catch (err) {
        next(err)
    }
}

module.exports = { getCategories, getReviewById, patchReviewById, getReviews }
