const express = require("express");

// Import controller functions from controllers
const { newGame, lob, hit, miss, status, cancel, concede } = require("../controllers/battleship.controller.js");
const battleshipRouter = express.Router();

// map routes to controller functions
battleshipRouter.post('/new/', newGame)
battleshipRouter.post('/lob', lob)
battleshipRouter.post('/hit', hit)
battleshipRouter.get('/miss', miss)
battleshipRouter.get('/status', status)
battleshipRouter.get('/cancel', cancel)
battleshipRouter.get('/concede', concede)

// export router for use by main application (app.js)
module.exports = battleshipRouter;