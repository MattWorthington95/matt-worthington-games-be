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


const selectReview = async (sort_by = "created_at", order = "DESC") => {


    let queryStr =
        `SELECT reviews.review_id, reviews.title, reviews.review_img_url,
    reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    `
    queryStr += ` ORDER BY ${sort_by} ${order}`


    // const { rows: log } = await db.query(`SELECT * FROM reviews`)
    // console.log(log[0]);

    const { rows: reviews } = await db.query(queryStr)
    return reviews

}

// reviews.review_id, reviews.title, reviews.review_img_url,
//     reviews.votes, reviews.category, reviews.owner, reviews.created_at 

// const selectReview = async (sort_by = "created_at", order = "DESC") => {

//     let queryStr = `SELECT * FROM reviews `
//     let sortByCommentCount = true
//     if (sort_by !== "comment_count") {
//         sortByCommentCount = false

//         queryStr += ` ORDER BY ${sort_by} ${order}`
//     }

//     const { rows: reviews } = await db.query(queryStr)

//     // TODO: look into SQL count, as think this can be done with one query
//     const reviewsWithCount = await Promise.all(reviews.map(async review => {
//         const reviewWithCountById = await selectReviewById(review.review_id)
//         return reviewWithCountById
//     }))

//     if (sortByCommentCount) {
//         return (reviewsWithCount.sort((a, b) => {
//             if (b.comment_count > a.comment_count) {
//                 return 1
//             } else if (a.comment_count > b.comment_count) {
//                 return -1
//             } else {
//                 return 0
//             }
//         }));
//     }
//     return reviewsWithCount
// }

// sort_by, which sorts the reviews by any valid column (defaults to date)

// order, which can be set to asc or desc for ascending or descending (defaults to descending)

// category, which filters the reviews by the category value specified in the query



module.exports = { selectCategories, selectReviewById, updateReviewById, selectReview }