'use client'
import { useState, useRef } from "react";
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DraggableShip from "./components/DraggableShip";
import Grid from "./components/Grid";


export default function Home() {
    // grid size
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);

    // ship counts
    const [destroyerCount, setDestroyerCount] = useState(1)
    const [submarineCount, setSubmarineCount] = useState(1)
    const [cruiserCount, setCruiserCount] = useState(1)
    const [BattleshipCount, setBattleshipCount] = useState(1)
    const [carrierCount, setCarrierCount] = useState(1)

    // ship placements
    const [ships, setShips] = useState([]);

    const handleDrop = (ship, row, col) => {
        setShips((prevShips) => [...prevShips, { ...ship, row, col }]);
    };



    // Control visibility of buttons
    const [newGame, setNewGame] = useState(true);
    const [startGame, setStartGame] = useState(false);

    const showStartGame = () => {
        setNewGame((prev) => !prev);
        setStartGame((prev) => !prev);
    };

    const styles = {
        container: "flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]",
        title: "text-5xl text-center w-full",
        main: "flex flex-col gap-[32px] items-center w-full",
        buttonGroup: "flex justify-center w-full gap-4",
        inputContainer: "flex gap-8 justify-center w-full pb-10",
        form: "flex flex-col items-center",
        label: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        footer: "flex gap-6 flex-wrap items-center justify-center",
        button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.container}>
                <p className={styles.title}>Battleship</p>
                <main className={styles.main}>
                    <div className={styles.buttonGroup}>
                        {newGame && (
                            <button className={styles.button} onClick={showStartGame}>
                                New Game
                            </button>
                        )}
                        {startGame && (
                            <button className={styles.button}>
                                Start Game
                            </button>
                        )}
                    </div>

                    {startGame && (
                        <div>
                            {/* Grid inputs */}
                            <div className={styles.inputContainer}>
                                <form className={styles.form}>
                                    <label htmlFor="rows-input" className={styles.label}>Grid Rows:</label>
                                    <input
                                        type="number"
                                        id="rows-input"
                                        placeholder="10"
                                        value={rows}
                                        required
                                        onChange={(e) => setRows(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>
                                <form className={styles.form}>
                                    <label htmlFor="cols-input" className={styles.label}>Grid Cols:</label>
                                    <input
                                        type="number"
                                        id="cols-input"
                                        placeholder="10"
                                        value={cols}
                                        required
                                        onChange={(e) => setCols(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>
                            </div>

                            {/* Ship count inputs */}
                            <div className={styles.inputContainer}>
                                <form className={styles.form}>
                                    <label htmlFor="destroyer-count" className={styles.label}>Destroyers:</label>
                                    <input
                                        type="number"
                                        id="destroyer-count"
                                        placeholder="1"
                                        value={destroyerCount}
                                        required
                                        onChange={(e) => setDestroyerCount(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>
                                <form className={styles.form}>
                                    <label htmlFor="submarine-count" className={styles.label}>Submarines:</label>
                                    <input
                                        type="number"
                                        id="submarine-count"
                                        placeholder="1"
                                        value={submarineCount}
                                        required
                                        onChange={(e) => setSubmarineCount(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>
                                <form className={styles.form}>
                                    <label htmlFor="cruiser-count" className={styles.label}>Cruiser:</label>
                                    <input
                                        type="number"
                                        id="cruiser-count"
                                        placeholder="1"
                                        value={cruiserCount}
                                        required
                                        onChange={(e) => setCruiserCount(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>
                                <form className={styles.form}>
                                    <label htmlFor="battleship-count" className={styles.label}>Battleships:</label>
                                    <input
                                        type="number"
                                        id="battleship-count"
                                        placeholder="1"
                                        value={BattleshipCount}
                                        required
                                        onChange={(e) => setBattleshipCount(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>
                                <form className={styles.form}>
                                    <label htmlFor="carrier-count" className={styles.label}>Carriers:</label>
                                    <input
                                        type="number"
                                        id="carrier-count"
                                        placeholder="1"
                                        value={carrierCount}
                                        required
                                        onChange={(e) => setCarrierCount(Number(e.target.value))}
                                        className={styles.input}
                                    />
                                </form>

                            </div>

                            {/* Show draggable ships */}
                            <div className={styles.inputContainer}>
                                {destroyerCount > 0 && <DraggableShip name="Destroyer" />}
                                {submarineCount > 0 && <DraggableShip name="Submarine" />}
                                {cruiserCount > 0 && <DraggableShip name="Cruiser" />}
                                {BattleshipCount > 0 && <DraggableShip name="Battleship" />}
                                {carrierCount > 0 && <DraggableShip name="Carrier" />}
                            </div>

                            {/* Game Board */}
                            <Grid rows={rows} cols={cols} onDrop={handleDrop} ships={ships} />
                        </div>
                    )}
                </main>
                <footer className={styles.footer}></footer>
            </div>
        </DndProvider>
    );
}
