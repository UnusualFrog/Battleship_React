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

// map ship index to its name (cruiser treated same as submarine)
const shipNames = ["destroyer", "submarine", "battleship", "carrier"];

// x,y
const defaultGridSize = [10, 10]

// number of ships, number aflota; index+2=size
const defaultFleet = [[1, 1], [2, 2], [1, 1], [1, 1]]

class Game {
    constructor(grid_size = defaultGridSize, fleet = defaultFleet) {
        this.gameState = "inactive";
        this.cycle = 0;
        this.startDate = new Date();
        this.duration_seconds = this.calculateDuration();
        this.grid_size = grid_size;
        this.clientFleet = fleet;
        this.serverFleet = JSON.parse(JSON.stringify(fleet));; // deep copy the fleet
        this.clientGameBoard;
        this.serverGameBoard;
        this.clientShipLocations = {};
        this.serverShipLocations = {};
        this.clientHitShipsCount = {
            "d": 0,
            "s": 0,
            "b": 0,
            "c": 0
        }
        this.serverHitShipsCount = {
            "d": 0,
            "s": 0,
            "b": 0,
            "c": 0
        }
        this.serverGuesses = []
    }

    // Dynamically calculates the duration of the game based on the start time and the current time
    calculateDuration() {
        let duration = (new Date - this.startDate) / 1000;
        this.duration_seconds = duration;
        return duration;
    }

    // Generates the client and server game boards based on the current grid size and places ships based on respetctive fleets
    generateBoard() {
        console.log(this.grid_size)
        let newBoard = Array.from({ length: this.grid_size[0] }, () => Array(this.grid_size[1]).fill('0'));
        let clientBoard = newBoard;
        let serverBoard = newBoard;

        // Generate the server's fleet placements
        this.generateFleetPlacements()

        // place server fleet on the server's board
        this.placeServerFleet(serverBoard)

        console.log(serverBoard)
        this.clientGameBoard = clientBoard;
        this.serverGameBoard = serverBoard;
    }

    generateFleetPlacements() {
        // Start with largest ship and work backwards to smallest
        for (let i = this.serverFleet.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.serverFleet[i][0]; j++) {
                let name = shipNames[i];
                let size = i + 2;
                let count = this.serverFleet[i][0];
                // console.log(name, size, count)

                // Attempt to place ships
                let success = false;
                while (!success) {
                    let isHorizontal = Math.floor(Math.random() * 2) ? true : false;
                    let startRow;
                    let endRow;
                    let startCol;
                    let endCol;

                    // Generate ship placement coordinates
                    if (isHorizontal) {
                        startRow = Math.floor(Math.random() * this.grid_size[0]) + 1;
                        endRow = startRow;
                        startCol = Math.floor(Math.random() * (this.grid_size[1] - (size - 1))) + 1;
                        endCol = startCol + (size - 1);
                    } else {
                        startRow = Math.floor(Math.random() * (this.grid_size[0] - (size - 1))) + 1;
                        endRow = startRow + (size - 1);
                        startCol = Math.floor(Math.random() * this.grid_size[1]) + 1;
                        endCol = startCol;
                    }

                    // console.log(isHorizontal ? "horizontal" : "vertical");
                    // console.log("row: ", startRow, endRow);
                    // console.log("col: ", startCol, endCol);

                    // Assume no collision until one is found
                    let collision = false;

                    // Check for collisions with existing ships
                    for (let shipKey in this.serverShipLocations) {
                        let ship = this.serverShipLocations[shipKey];

                        if (ship.isHorizontal) {
                            if (isHorizontal) {
                                // Horizontal vs Horizontal collision check
                                if (startRow == ship.startRow && ((startCol >= ship.startCol && startCol <= ship.endCol) ||
                                    (endCol >= ship.startCol && endCol <= ship.endCol) ||
                                    (startCol <= ship.startCol && endCol >= ship.endCol))) {
                                    collision = true;
                                    break; // Exit the collision check loop if collision found
                                }
                            }
                            else {
                                // Horizontal vs Vertical collision check
                                if (startCol >= ship.startCol && startCol <= ship.endCol &&
                                    ship.startRow >= startRow && ship.startRow <= endRow) {
                                    collision = true;
                                    break;
                                }
                            }
                        }
                        else {
                            if (isHorizontal) {
                                // Vertical vs Horizontal collision check
                                if (startRow >= ship.startRow && startRow <= ship.endRow &&
                                    ship.startCol >= startCol && ship.startCol <= endCol) {
                                    collision = true;
                                    break;
                                }
                            }
                            else {
                                // Vertical vs Vertical collision check
                                if (startCol == ship.startCol && ((startRow >= ship.startRow && startRow <= ship.endRow) ||
                                    (endRow >= ship.startRow && endRow <= ship.endRow) ||
                                    (startRow <= ship.startRow && endRow >= ship.endRow))) {
                                    collision = true;
                                    break;
                                }
                            }
                        }
                    }

                    // If no collision was detected, add the ship
                    if (!collision) {
                        this.serverShipLocations[name + "_" + (j + 1)] = {
                            "name": name,
                            "isHorizontal": isHorizontal,
                            "startRow": startRow,
                            "endRow": endRow,
                            "startCol": startCol,
                            "endCol": endCol
                        };
                        success = true;
                    }
                    // If collision was detected, the while loop will continue and try again
                }
            }
        }
        // console.log(this.serverShipLocations)
    }

    placeServerFleet(serverBoard) {
        for (let shipLocationKey in this.serverShipLocations) {
            let ship = this.serverShipLocations[shipLocationKey]
            console.log(ship)

            if (ship.isHorizontal) {
                for (let x = ship.startCol - 1; x <= ship.endCol - 1; x++) {
                    serverBoard[ship.startRow - 1][x] = ship.name[0];
                }
            } else {
                for (let y = ship.startRow - 1; y <= ship.endRow - 1; y++) {
                    serverBoard[y][ship.startCol - 1] = ship.name[0];
                }
            }

        }
    }

    // check if fleet area is larger than grid area
    checkArea(grid, fleet) {
        let maxArea = grid[0] * grid[1];
        let fleetArea = 0;

        for (let i = 0; i < fleet.length; i++) {
            fleetArea += (fleet[i][0] * (i + 2))
        }
        return maxArea <= fleetArea;
    }

    checkLob(x, y) {
        // console.log(this.serverGameBoard[x - 1][y - 1]);

        switch (this.serverGameBoard[x - 1][y - 1]) {
            // Miss if tile is open water or an already hit ship
            case "0":
            case "X":
                return "miss"
            case "d":
                // Set the tile to a sunk ship represented by X
                this.serverGameBoard[x - 1][y - 1] = "X"
                // Increase count of hit destroyers
                this.serverHitShipsCount["d"] = this.serverHitShipsCount["d"] + 1;
                // If destroyer hit count matches length of destroyer, reduce count of afloat destroyers
                if (this.serverHitShipsCount["d"] % 2 == 0) {
                    this.serverFleet[0][1]--;

                    if (this.checkServerDefeat()) {
                        return "defeated"
                    }

                    return "sunk"
                }

                // console.log(this.serverHitShipsCount);
                // console.log(this.serverFleet);

                return "hit"
            case "s":
                // Set the tile to a sunk ship represented by X
                this.serverGameBoard[x - 1][y - 1] = "X"
                // Increase count of hit submarines
                this.serverHitShipsCount["s"] = this.serverHitShipsCount["s"] + 1;
                // If submarine hit count matches length of submarine, reduce count of afloat submarines
                if (this.serverHitShipsCount["s"] % 3 == 0) {
                    this.serverFleet[1][1]--;

                    if (this.checkServerDefeat()) {
                        return "defeated"
                    }

                    return "sunk"
                }

                // console.log(this.serverHitShipsCount);
                // console.log(this.serverFleet);

                return "hit"
            case "b":
                // Set the tile to a sunk ship represented by X
                this.serverGameBoard[x - 1][y - 1] = "X"
                // Increase count of hit battleships
                this.serverHitShipsCount["b"] = this.serverHitShipsCount["b"] + 1;
                // If battleship hit count matches length of battleship, reduce count of afloat battleships
                if (this.serverHitShipsCount["b"] % 4 == 0) {
                    this.serverFleet[2][1]--;

                    if (this.checkServerDefeat()) {
                        return "defeated"
                    }

                    return "sunk"
                }

                // console.log(this.serverHitShipsCount);
                // console.log(this.serverFleet);

                return "hit"
            case "c":
                // Set the tile to a sunk ship represented by X
                this.serverGameBoard[x - 1][y - 1] = "X"
                // Increase count of hit cruisers
                this.serverHitShipsCount["c"] = this.serverHitShipsCount["c"] + 1;
                // If cruiser hit count matches length of cruiser, reduce count of afloat cruisers
                if (this.serverHitShipsCount["c"] % 5 == 0) {
                    this.serverFleet[3][1]--;

                    if (this.checkServerDefeat()) {
                        return "defeated"
                    }

                    return "sunk"
                }

                // console.log(this.serverHitShipsCount);
                // console.log(this.serverFleet);

                return "hit"
        }

    }

    // return true if all server ship afloat counts are 0, ergo all ships are sunk
    checkServerDefeat() {
        return !(this.serverFleet[0][1] || this.serverFleet[1][1] || this.serverFleet[2][1] || this.serverFleet[3][1])
    }

    // return true if all client ship afloat counts are 0, ergo all ships are sunk
    checkClientDefeat() {
        return !(this.clientFleet[0][1] || this.clientFleet[1][1] || this.clientFleet[2][1] || this.clientFleet[3][1])
    }

    generateGuess() {
        let row, col;

        // Keep generating a guess until it doesn't exist in serverGuesses
        do {
            row = Math.floor(Math.random() * this.grid_size[0]) + 1;
            col = Math.floor(Math.random() * this.grid_size[1]) + 1;
        } while (this.serverGuesses.some(guess => guess[0] === row && guess[1] === col));

        // Once a unique guess is found, add it to serverGuesses
        this.serverGuesses.push([row, col]);

        return [row, col];
    }

    handleHit(shipHit) {
        switch (shipHit) {
            case "d":
                // Increase count of hit destroyers
                this.clientHitShipsCount["d"] = this.clientHitShipsCount["d"] + 1;
                // If destroyer hit count matches length of destroyer, reduce count of afloat destroyers
                if (this.clientHitShipsCount["d"] % 2 == 0) {
                    this.clientFleet[0][1]--;

                    if(this.checkClientDefeat()) {
                        return "defeated"
                    }
                }
                return "hit";
            case "s":
                // Increase count of hit submarines
                this.clientHitShipsCount["s"] = this.clientHitShipsCount["s"] + 1;
                // If submarine hit count matches length of submarine, reduce count of afloat submarines
                if (this.clientHitShipsCount["s"] % 3 == 0) {
                    this.clientFleet[1][1]--;

                    if(this.checkClientDefeat()) {
                        return "defeated"
                    }
                }
                return "hit";
            case "b":
                // Increase count of hit battleships
                this.clientHitShipsCount["b"] = this.clientHitShipsCount["b"] + 1;
                // If battleship hit count matches length of battleship, reduce count of afloat battleships
                if (this.clientHitShipsCount["b"] % 4 == 0) {
                    this.clientFleet[2][1]--;

                    if(this.checkClientDefeat()) {
                        return "defeated"
                    }
                }
                return "hit";
            case "c":
                // Increase count of hit cruisers
                this.clientHitShipsCount["c"] = this.clientHitShipsCount["c"] + 1;
                // If cruiser hit count matches length of cruiser, reduce count of afloat cruisers
                if (this.clientHitShipsCount["c"] % 5 == 0) {
                    this.clientFleet[3][1]--;

                    if(this.checkClientDefeat()) {
                        return "defeated"
                    }
                }
                return "hit";
        }
    }
}

// export game class for use in battleship controller
module.exports = Game