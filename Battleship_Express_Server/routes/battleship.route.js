const express = require("express");
const { getBattleship } = require("../controllers/battleship.controller.js");
const battleshipRouter = express.Router ();

battleshipRouter.get('/',  getBattleship)

module.exports = battleshipRouter;