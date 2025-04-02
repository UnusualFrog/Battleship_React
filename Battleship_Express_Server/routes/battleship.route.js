const express = require("express");

// Import controller functions from controllers
const { newGame, getStatus } = require("../controllers/battleship.controller.js");
const battleshipRouter = express.Router();

// map routes to controller functions
battleshipRouter.get('/new/', newGame)
battleshipRouter.get('/status', getStatus)

// export router for use by main application (app.js)
module.exports = battleshipRouter;