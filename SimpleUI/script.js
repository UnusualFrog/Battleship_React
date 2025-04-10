
document.getElementById('new-game').addEventListener('click', function () {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;

    const destroyerCount = document.getElementById('destroyer-count').value;
    const submarineCount = document.getElementById('submarine-count').value;
    const battleshipCount = document.getElementById('battleship-count').value;
    const carrierCount = document.getElementById('carrier-count').value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "grid": [10, 10],
        "fleet": [
            [1, 1], [2, 2], [1, 1], [1, 1]
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/new", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let gameStartMessage = `<p>Starting new game with board size: ${rows}x${cols}</p>`;
            gameStartMessage += `<p>Ships: ${destroyerCount} Destroyer(s), ${submarineCount} Submarine(s), ${battleshipCount} Battleship(s), ${carrierCount} Carrier(s)</p>`;
            // Add string version of JSON result
            gameStartMessage += `<p>Game data: ${JSON.stringify(result)}</p>`;
            document.getElementById('game-display').innerHTML += gameStartMessage;
            document.getElementById('game-status').innerHTML = result.status;
        })
        .catch((error) => console.error(error));



});

document.getElementById('make-guess').addEventListener('click', function () {
    const guessX = document.getElementById('guess-x').value;
    const guessY = document.getElementById('guess-y').value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "grid": [guessX, guessY],
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/lob", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let message = `<p>You guessed: ${guessX}, ${guessY}</p>`;
            message += `<p>Game data: ${JSON.stringify(result)}</p>`;

            // Add string version of JSON result
            document.getElementById('game-display').innerHTML += message;
            document.getElementById('game-status').innerHTML = result.status;
            document.getElementById('guess-x').value = '';
            document.getElementById('guess-y').value = '';
        })
        .catch((error) => console.error(error));



});

function getSelectedShipType() {
    const radioButtons = document.querySelectorAll('input[name="shipType"]');
    let selectedValue;
    
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            break;
        }
    }
    
    return selectedValue; // Will return "d", "s", "b", or "c"
}

document.getElementById('hit-button').addEventListener('click', function () {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const shipType = getSelectedShipType();

    const raw = JSON.stringify({
        "ship": shipType
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/hit", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let message = `<p>You marked the last guess as a HIT!</p>`;
            message += `<p>Game data: ${JSON.stringify(result)}</p>`;

            // Add string version of JSON result
            document.getElementById('game-display').innerHTML += message;
            document.getElementById('game-status').innerHTML = result.status;
        })
        .catch((error) => console.error(error));
});

document.getElementById('miss-button').addEventListener('click', function () {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/miss", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let message = `<p>You marked the last guess as a MISS!</p>`;
            message += `<p>Game data: ${JSON.stringify(result)}</p>`;

            // Add string version of JSON result
            document.getElementById('game-display').innerHTML += message;
            document.getElementById('game-status').innerHTML = result.status;
        })
        .catch((error) => console.error(error));
});

document.getElementById('status-button').addEventListener('click', function () {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/status", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let message = `<p>Status requested</p>`;
            message += `<p>Game data: ${JSON.stringify(result)}</p>`;

            // Add string version of JSON result
            document.getElementById('game-display').innerHTML += message;
            document.getElementById('game-status').innerHTML = result.status;
        })
        .catch((error) => console.error(error));
});

document.getElementById('concede-button').addEventListener('click', function () {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/concede", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let message = `<p>You conceded. Computer wins!</p>`;
            message += `<p>Game data: ${JSON.stringify(result)}</p>`;

            // Add string version of JSON result
            document.getElementById('game-display').innerHTML += message;
            document.getElementById('game-status').innerHTML = result.status;
        })
        .catch((error) => console.error(error));
});

document.getElementById('quit-button').addEventListener('click', function () {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:3001/api/battleship/cancel", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Display game start information
            let message = `<p>Game cancelled.</p>`;
            message += `<p>Game data: ${JSON.stringify(result)}</p>`;

            // Add string version of JSON result
            document.getElementById('game-display').innerHTML += message;
            document.getElementById('game-status').innerHTML = result.status;
        })
        .catch((error) => console.error(error));
});

// Function to append content to the display area and auto-scroll to bottom
function appendToDisplay(content) {
    const display = document.getElementById('game-display');
    display.innerHTML += content;
    display.scrollTop = display.scrollHeight; // Auto-scroll to bottom
}

// Override the default behavior of adding to innerHTML
const originalDisplay = document.getElementById('game-display');
const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

Object.defineProperty(originalDisplay, 'innerHTML', {
    set: function(content) {
        originalInnerHTML.set.call(this, content);
        this.scrollTop = this.scrollHeight;
    },
    get: function() {
        return originalInnerHTML.get.call(this);
    }
});