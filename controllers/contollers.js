const { selectCategories, selectReviewsById } = require("../models/models");

const getCategories = async (req, res) => {
    const categories = await selectCategories()
    res.status(200).send({ categories })
}

const getReviewById = async (req, res, next) => {
    try {
        const { review_id } = req.params
        const review = await selectReviewsById(review_id)
        res.status(200).send({ review })
    } catch (err) {
        next(err)
    }
}

module.exports = { getCategories, getReviewById }
