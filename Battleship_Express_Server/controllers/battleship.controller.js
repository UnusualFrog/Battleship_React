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

        // Check if the area of the fleet would fill the entire board, empty space is required
        if (game.checkArea(req.body.grid, req.body.fleet)) {
            throw new Error("Specified fleet exceeds area of specified grid, please modify paramaters")
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
        if (game.gameState == "inactive") {
            throw new Error("No game in progress, cannot lob")
        }

        let result = game.checkLob(req.body.grid[0], req.body.grid[1])
        game.cycle++;
        game.calculateDuration();

        let response = {};
        switch (result) {
            case "hit":
                response = {
                    'status': 'hit',
                    'grid': game.generateGuess(),
                    'cycle': game.cycle, 'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
                }
                break;
            case "miss":
                response = {
                    'status': 'miss',
                    'grid': game.generateGuess(),
                    'cycle': game.cycle, 'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
                }
                break;
            case "sunk":
                response = {
                    'status': 'sunk',
                    'grid': game.generateGuess(),
                    'cycle': game.cycle, 'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
                }
                break;
            case "defeated":
                game.gameState = "inactive"
                response = {
                    'status': 'concede',
                    'message': 'You win',
                    'cycle': game.cycle,
                    'duration': game.duration_seconds,
                    'myfleet': game.serverFleet,
                    'yourfleet': game.clientFleet,
                    'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
                }
                break;
        }


        res.status(200).json(response);
    } catch (err) {
        let response = {
            'status': 'reject', 'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
        }
        res.status(500).json(response);
    }
}

const hit = async (req, res) => {
    try {
        if (game.gameState == "inactive") {
            throw new Error("No game in progress, cannot hit")
        }

        let response = {
            'status': 'ok'
        }

        let result = game.handleHit(req.body.ship);

        if (result == "defeated") {
            this.gameState="inactive"
            response = {
                'status': 'defeated',
                'message': 'You lose',
                'cycle': game.cycle,
                'duration': game.duration_seconds,
                'myfleet': game.serverFleet,
                'yourfleet': game.clientFleet,
                'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
            }
        }

        res.status(200).json(response);
    } catch (err) {
        let response = {
            'status': 'reject',
            'message': 'Unexpected',
            'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
        }
        console.log(err)
        res.status(500).json(response);
    }
}

const miss = async (req, res) => {
    try {
        if (game.gameState == "inactive") {
            throw new Error("No game in progress, cannot miss")
        }

        let response = {
            'status': 'ok'
        }
        res.status(200).json(response);
    } catch (err) {

        let response = {
            'status': 'reject',
            'message': 'Unexpected',
            'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
        }
        console.log(err)
        res.status(500).json(response);
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
                'myfleet': game.serverFleet,
                'yourfleet': game.clientFleet,
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
        if (game.gameState == "inactive") {
            throw new Error("No game in progress, cannot cancel")
        }

        game.calculateDuration();
        game.gameState = "inactive";

        let response = {
            'status': 'ended',
            'message': 'Game over. Thank you for playing',
            'cycle': game.cycle,
            'duration': game.duration_seconds,
            'myfleet': game.serverFleet,
            'yourfleet': game.clientFleet,
            'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
        }
        res.status(200).json(response);
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'status': 'reject', 'time': new Date().toLocaleTimeString('en-GB', { hour12: true }) });
    }
}

const concede = async (req, res) => {
    try {
        if (game.gameState == "inactive") {
            throw new Error("No game in progress, cannot concede")
        }

        game.calculateDuration();
        game.gameState = "inactive"

        let response = {
            'status': 'ended',
            'message': 'I win. Thank you for playing.',
            'cycle': game.cycle,
            'duration': game.duration_seconds,
            'myfleet': game.serverFleet,
            'yourfleet': game.clientFleet,
            'time': new Date().toLocaleTimeString('en-GB', { hour12: true })
        }
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'status': 'reject', 'time': new Date().toLocaleTimeString('en-GB', { hour12: true }) });
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