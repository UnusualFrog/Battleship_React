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
        this.serverFleet = fleet;
        this.clientGameBoard;
        this.serverGameBoard;
        this.clientShipLocations = {};
        this.serverShipLocations = {};
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
        for (let i = 0; i < this.serverFleet.length; i++) {
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
                for (let x = ship.startCol-1; x <= ship.endCol-1; x++) {
                    serverBoard[ship.startRow - 1][x] = ship.name[0];
                }
            } else {
                for (let y = ship.startRow-1; y <= ship.endRow-1; y++) {
                    serverBoard[y][ship.startCol - 1] = ship.name[0];
                }
            }
            
        }
    }
}

// export game class for use in battleship controller
module.exports = Game