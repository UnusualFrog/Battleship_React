// ```
// * Class for managing game sessions of battleship
// *
// * @gameState (string) - determines state of game [inactive, client_turn, server_turn]
// * @cycle (int) - determines how many turns have passed in the game
// * @startDate (Date) - Stores the date and time when the game was initialized.
// * @duration_seconds (float) - Duration of the game in seconds, calculated dynamically.
// * @grid_size (object) - Dimensions of the game board { x: <int>, y: <int> }.
// * @clientFleet (object) - Represents the player's fleet, tracking total ships and afloat ships.
// * @serverFleet (object) - Represents the server's fleet, tracking total ships and afloat ships.
// * @clientGameBoard (array) - A 2D array representing the client's game grid.
// * @serverGameBoard (array) - A 2D array representing the server's game grid.
// ```

default_grid_size = { x: 10, y: 10 }
default_fleet = {
    "destroyer":    { total: 1, afloat: 1, size: 2 },
    "submarine":    { total: 2, afloat: 2, size: 3 },
    "battleship":   { total: 1, afloat: 1, size: 4 },
    "carrier":      { total: 1, afloat: 1, size: 5 }
}

class Game {
    constructor(grid_size = default_grid_size, fleet = default_fleet) {
        this.gameState = "inactive";
        this.cycle = 0;
        this.startDate = new Date();
        this.duration_seconds = this.calculateDuration();
        this.grid_size = grid_size;
        this.clientFleet = fleet;
        this.serverFleet = fleet;
        this.clientGameBoard;
        this.serverGameBoard;
    }

    // Dynamically calculates the duration of the game based on the start time and the current time
    calculateDuration() {
        let duration = (new Date - this.startDate) / 1000;
        this.duration_seconds = duration;
        return duration;
    }

    // Generates the client and server game boards based on the current grid size and places ships based on respetctive fleets
    generateBoard() {
        let newBoard = Array.from({ length: this.grid_size.x }, () => Array(this.grid_size.y).fill(0));
        let clientBoard = newBoard;
        let serverBoard = newBoard;

        //TODO: Add logic to place ships on grid
        console.log(newBoard)
        this.clientGameBoard = clientBoard;
        this.serverGameBoard = serverBoard;
    }
}

// export game class for use in battleship controller
module.exports = Game