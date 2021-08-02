
const db = require('../connection');
const format = require("pg-format");
const { formatCatData, formatUserData } = require('../utils/data-manipulation');


const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query(`DROP TABLE IF EXISTS comments;`)
  await db.query(`DROP TABLE IF EXISTS reviews;`)
  await db.query(`DROP TABLE IF EXISTS categories;`)
  await db.query(`DROP TABLE IF EXISTS users;`)

  console.log("All tables deleted");

  await db.query(
    `
    CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY UNIQUE NOT NULL,
      description VARCHAR
    )
    `
  )
  console.log("categories table made");

  await db.query(
    `
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY UNIQUE NOT NULL,
      avatar_url TEXT,
      name VARCHAR NOT NULL
    )
    `
  )
  console.log("users table made");

  await db.query(
    `
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body VARCHAR NOT NULL,
      designer VARCHAR NOT NULL,
      review_img_url TEXT NOT NULL,
      votes INT,
      category VARCHAR NOT NULL REFERENCES categories(slug), 
      owner VARCHAR NOT NULL REFERENCES users(username),
      created_at DATE NOT NULL
    )
    `
  )
  console.log("reviews table created");

  await db.query(
    `
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR NOT NULL REFERENCES users(username),
      review_id INT NOT NULL REFERENCES reviews(review_id),
      votes INT,
      created_at DATE,
      body TEXT NOT NULL 
    )
    `
  )
  console.log("comments table created");

  const formattedCatData = formatCatData(categoryData)

  const categoryInsertionQueryStr = format(
    `
    INSERT INTO categories
    (slug, description)
    VALUES %L
    RETURNING *;
    `, formattedCatData
  )

  await db.query(categoryInsertionQueryStr)
  console.log("inserted into category table!");
};

const formattedUserData = formatUserData(userData)

const userInsertionQueryStr = format(
  `
      INSERT INTO users
      (username, avatar_url, name)
      VALUES %L
      RETURNING *;
      `, formattedUserData
)

await db.query(userInsertionQueryStr)
console.log("inserted into users table");

module.exports = { seed };
