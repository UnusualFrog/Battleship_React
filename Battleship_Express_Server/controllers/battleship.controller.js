// Import game class
const Game = require("../game_class");

// Initialize inactive game on load
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
        game = new Game(req.body.grid, req.body.fleet)
        game.gameState = "client_turn"

        //TODO: add logic for processing user placement of ships

        game.generateBoard()

        let response = {
            'status': 'started',
            'message': 'New game. You start',
            'cycle': game.cycle,
            'time': game.startDate.toLocaleTimeString('en-GB', { hour12: true })
        }

        res.status(200).json(response);
    } catch (err) {
        let response = {
            'status': 'reject'
        }
        console.log(err)
        res.status(500).json({ response });
    }
}

const lob = async (req, res) => {
    try {

        res.status(200).json("lobbed");
    } catch (err) {
        res.status(500).json(err);
    }
}

const hit = async (req, res) => {
    try {

        res.status(200).json("hit");
    } catch (err) {
        res.status(500).json(err);
    }
}

const miss = async (req, res) => {
    try {

        res.status(200).json("miss");
    } catch (err) {
        res.status(500).json(err);
    }
}

// route for checking current game status
// updates the duration variable 
const status = async (req, res) => {
    if (game.gameState != 'inactive') {
        try {
            // Update game duration
            game.calculateDuration()

            response = {
                'status': 'in progress',
                'cycle': game.cycle,
                'duration': game.duration_seconds,
                'myfleet': game.clientFleet,
                'yourfleet': game.serverFleet,
                'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
            }
            res.status(200).json(response);
        }
        catch (err) {
            res.status(500).json({ 'status': 'reject', 'time': new Date().toLocaleTimeString('en-GB', { hour12: true }) });
        }
    } else {
        res.status(500).json({ 'status': 'reject', 'time': new Date().toLocaleTimeString('en-GB', { hour12: true }) });
    }
}

const cancel = async (req, res) => {
    try {

        res.status(200).json("quit");
    } catch (err) {
        res.status(500).json(err);
    }
}

const concede = async (req, res) => {
    try {

        res.status(200).json("concede");
    } catch (err) {
        res.status(500).json(err);
    }
}

// export controller functions for router use
module.exports = {
    newGame,
    lob,
    hit,
    miss,
    status,
    cancel,
    concede
};