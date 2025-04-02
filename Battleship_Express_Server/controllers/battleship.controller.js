// Import game class
const Game = require("../game_class");

// Instantiate new inactive game on load
var game = new Game();

// route for generating new game
// receives grid size, fleet size, and ship placements from client request
// fails if game is not in "inactive" state

const newGame = async (req, res) => {
    try {
        if (game) {
            if (game.gameState != "inactive") {
                throw new Error("Game in progress, Cannot start new game")
            }
        }

        // Generate new game and set inital values
        game = new Game()
        game.gameState = "client_turn"

        //TODO: add logic for processing user placement of ships

        game.generateBoard()

        res.status(200).json("New Game Started on " + game.startDate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// route for checking current game status
// updates the duration variable 
const getStatus = async (req, res) => {
    try {
        game.calculateDuration()
        res.status(200).json(game);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// export controller functions for router use
module.exports = {
    newGame,
    getStatus
};