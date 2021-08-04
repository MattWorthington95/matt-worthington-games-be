const db = require("../db/connection");

const selectCategories = async () => {
    const { rows: categories } = await db.query('SELECT * FROM categories')
    return categories
}

const selectReviewById = async (review_id) => {
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

const updateReviewById = async (review_id, inc_votes) => {
    await selectReviewById(review_id)
    if (inc_votes === undefined) {
        return Promise.reject({ status: 404, message: 'Incorrect key passed for Patched' })
    }
    if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 404, message: 'inc_votes need to be a number' })
    }

    const review = await selectReviewById(review_id)
    const updatedReview = await db.query(
        `UPDATE reviews 
        SET votes = votes + $1
        WHERE review_id = $2 RETURNING *;`, [inc_votes, review_id]
    )
    return updatedReview.rows[0]
}

module.exports = { selectCategories, selectReviewById, updateReviewById }