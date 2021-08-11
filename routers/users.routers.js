const app = require("../app");
const { getAllUsers, getUserByUsername } = require("../controllers/contollers");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
