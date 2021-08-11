const app = require("../app");
const { getCategories } = require("../controllers/controllers");
const categoriesRouter = require("express").Router();

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
