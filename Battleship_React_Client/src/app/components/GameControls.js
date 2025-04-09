// components/GameControls.js
'use client';

export default function GameControls({
    gameState,
    onNewGame,
    onResetShips,
    onStartGame
}) {
    const styles = {
        buttonGroup: "flex justify-center w-full gap-4",
        button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    };

    return (
        <div className={styles.buttonGroup}>
            {gameState == "newGame" && (
                <button className={styles.button} onClick={onNewGame}>
                    New Game
                </button>
            )}
            {gameState == "startGame" && (
                <>
                    <button className={styles.button} onClick={onResetShips}>
                        Reset Ships
                    </button>
                    <button className={styles.button} onClick={onStartGame}>
                        Start Game
                    </button>
                </>
            )}
        </div>
    );
}