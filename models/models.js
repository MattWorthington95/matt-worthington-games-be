const db = require("../db/connection");

const selectCategories = async () => {
    const { rows: categories } = await db.query('SELECT * FROM categories')
    return categories
}

const selectReviewsById = async (review_id) => {
    if (/\d+$/.test(review_id)) {
        const { rows: review } = await db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])


        if (review.length === 0) {
            return Promise.reject({ status: 404, message: 'Review not found' })
        }

        const { rows: commentsOnReview } = await db.query('SELECT * FROM comments WHERE review_id = $1', [review_id])

        review[0].comment_count = commentsOnReview.length
        return review[0]
    } else {
        return Promise.reject({ status: 404, message: 'Invalid Review Id' })
    }
}

module.exports = { selectCategories, selectReviewsById }