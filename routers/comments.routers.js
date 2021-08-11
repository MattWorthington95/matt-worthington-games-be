const app = require("../app");
const { deleteCommentById } = require("../controllers/controllers");
const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;
