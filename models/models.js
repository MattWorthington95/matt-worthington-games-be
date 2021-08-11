const { query } = require("../db/connection");
const db = require("../db/connection");
const fs = require("fs");

const selectCategories = async () => {
  const { rows: categories } = await db.query("SELECT * FROM categories");
  return categories;
};

const selectReviewById = async (review_id) => {
  if (/\d+$/.test(review_id)) {
    const { rows: review } = await db.query(
      "SELECT * FROM reviews WHERE review_id = $1",
      [review_id]
    );

    if (review.length === 0) {
      return Promise.reject({ status: 404, message: "Review not found" });
    }

    const { rows: commentsOnReview } = await db.query(
      "SELECT * FROM comments WHERE review_id = $1",
      [review_id]
    );

    review[0].comment_count = commentsOnReview.length;
    return review[0];
  } else {
    return Promise.reject({ status: 400, message: "Invalid Review Id" });
  }
};

const updateReviewById = async (review_id, inc_votes) => {
  await selectReviewById(review_id);
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 404,
      message: "Incorrect key passed for Patched",
    });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      message: "inc_votes need to be a number",
    });
  }

  const { rows: updatedReview } = await db.query(
    `UPDATE reviews 
        SET votes = votes + $1
        WHERE review_id = $2 RETURNING *;`,
    [inc_votes, review_id]
  );
  return updatedReview[0];
};

const selectReview = async (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  const validColumns = [
    "review_id",
    "title",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];
  const validCategories = {
    eurogame: "euro game",
    socialdeduction: "social deduction",
    dexterity: "dexterity",
    childrensgame: "children''s game",
  };

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: "Invalid 'sort by' term. It does not exist",
    });
  }
  if (order) {
    if (order !== "ASC" && order !== "DESC") {
      return Promise.reject({ status: 400, message: "Invalid order declared" });
    }
  }

  let queryStr = `SELECT reviews.review_id, reviews.title, reviews.review_img_url,
    reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id`;

  const queryValues = [];

  if (category) {
    if (validCategories[category]) {
      queryStr += ` WHERE reviews.category = $1`;
      queryValues.push(validCategories[category]);
    } else {
      return Promise.reject({
        status: 400,
        message: "Invalid category declared",
      });
    }
  }

  queryStr += ` GROUP BY reviews.review_id`;
  queryStr += ` ORDER BY ${sort_by} ${order}`;

  const { rows: reviews } = await db.query(queryStr, queryValues);
  return reviews;
};

const selectCommentsByReviewId = async (review_id) => {
  await selectReviewById(review_id);

  let queryStr = `SELECT * FROM comments WHERE review_id = $1`;
  const queryValues = [review_id];
  const { rows: comments } = await db.query(queryStr, queryValues);
  comments.forEach((comment) => {
    delete comment.review_id;
  });
  return comments;
};

const addComment = async (review_id, username, body) => {
  await selectReviewById(review_id);

  if (typeof username !== "string") {
    return Promise.reject({
      status: 400,
      message: "Invalid username key or value",
    });
  } else if (typeof body !== "string") {
    return Promise.reject({
      status: 400,
      message: "Invalid body key or value",
    });
  }
  const validKeys = ["username", "body"];
  let queryStr = `INSERT INTO comments
         (author, review_id, votes, created_at, body)
         VALUES
         ($1, $2, $3, $4, $5)
         RETURNING*
    `;
  const queryValues = [username, review_id, 0, new Date(), body];
  const { rows: addedComment } = await db.query(queryStr, queryValues);
  delete addedComment[0].review_id;
  return addedComment[0];
};

const selectEndPoints = async () => {
  const fsPromises = require("fs").promises;
  const data = await fsPromises
    .readFile("./endpoints.json", "utf-8")
    .catch((err) => console.error("Failed to read file", err));

  return JSON.parse(data.toString());
  // const file = await fs.readFile("../end");
};

const removeCommentById = async (comment_id) => {
  if (/\d+$/.test(comment_id)) {
    const { rows: comment } = await db.query(
      `DELETE from comments WHERE comment_id = $1 RETURNING *`,
      [comment_id]
    );
    if (comment.length === 0)
      return Promise.reject({ status: 404, message: "Comment Id Not Found" });
  } else {
    return Promise.reject({ status: 400, message: "Invalid Comment Id" });
  }
};

const selectUsers = async () => {
  const { rows: users } = await db.query(`SELECT username FROM users`);
  return users;
};

const selectUserById = async (username) => {
  const { rows: user } = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  if (user.length === 0)
    return Promise.reject({ status: 404, message: "Username doesnt exist" });
  return user[0];
};

module.exports = {
  selectCategories,
  selectReviewById,
  updateReviewById,
  selectReview,
  selectCommentsByReviewId,
  addComment,
  selectEndPoints,
  removeCommentById,
  selectUsers,
  selectUserById,
};
