const app = require("../app");
const {
  getAllUsers,
  getUserByUsername,
  patchCommentById,
} = require("../controllers/controllers");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/:username").get(getUserByUsername).patch(patchCommentById);

module.exports = usersRouter;
