

const getBattleship = async (req, res) => {
    try {
        const battleship = "Welcome to Battleship"
        res.status(200).json(battleship);
    }
    catch (err) {
        res.status(500).json({ message: err.message});
    }
}

const newGame = async (req, res) => {
    try {
        if (gameState) {

        }

    } catch (err) {

    }
}

module.exports = {
    getBattleship
};