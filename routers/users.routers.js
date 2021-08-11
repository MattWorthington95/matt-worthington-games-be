const app = require("../app");
const { getAllUsers } = require("../controllers/contollers");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);

module.exports = usersRouter;
