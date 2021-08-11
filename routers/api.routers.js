const app = require("../app");
const { getEndPoints } = require("../controllers/contollers");
const categoriesRouter = require("./categories.routers");
const commentsRouter = require("./comments.routers");
const reviewRouter = require("./review.routers");
const apiRouter = require("express").Router();

apiRouter.get("/", getEndPoints);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
