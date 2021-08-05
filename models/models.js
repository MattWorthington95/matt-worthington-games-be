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
        // console.log(commentsOnReview, "<<<< COMMENTS ON REVIEWS");
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

    const { rows: updatedReview } = await db.query(
        `UPDATE reviews 
        SET votes = votes + $1
        WHERE review_id = $2 RETURNING *;`, [inc_votes, review_id]
    )
    return updatedReview[0]
}


const selectReview = async (sort_by = "created_at", order = "DESC", category) => {

    const validColumns = [
        "review_id",
        "title",
        "review_img_url",
        "votes",
        "category",
        "owner",
        "created_at",
        "comment_count"
    ]
    const validCategories = {
        'eurogame': 'euro game',
        'socialdeduction': 'social deduction',
        "dexterity": "dexterity"
    }


    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, message: "Invalid 'sort by' term. It does not exist" })
    }
    if (order) {
        if (order !== "ASC" && order !== "DESC") {
            return Promise.reject({ status: 400, message: "Invalid order declared" })
        }
    }

    let queryStr =
        `SELECT reviews.review_id, reviews.title, reviews.review_img_url,
    reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    `

    const queryValues = []

    if (category) {
        if (validCategories[category]) {
            queryStr += ` WHERE reviews.category = $1`
            queryValues.push(validCategories[category])
        } else {
            return Promise.reject({ status: 400, message: "Invalid category declared" })
        }
    }

    queryStr += ` GROUP BY reviews.review_id`
    queryStr += ` ORDER BY ${sort_by} ${order}`

    const { rows: reviews } = await db.query(queryStr, queryValues)
    return reviews
}



module.exports = { selectCategories, selectReviewById, updateReviewById, selectReview }