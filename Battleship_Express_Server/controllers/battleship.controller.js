

const getBattleship = async (req, res) => {
    try {
        const battleship = "Welcome to Battleship"
        res.status(200).json(battleship);
    }
    catch (err) {
        res.status(500).json({ message: err.message});
    }
}

module.exports = {
    getBattleship
};