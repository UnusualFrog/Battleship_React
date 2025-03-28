'use client'
import { useState } from "react";

export default function Home() {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);
    // Control visibilty of buttons
    const [newGame, setNewGame] = useState(true);
    const [startGame, setStartGame] = useState(false);
    
    const showStartGame = () => {
        setNewGame((prev) => !prev);
        setStartGame((prev) => !prev);
    };

    const styles = {
        container: "grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]",
        title: "text-5xl text-center w-full", // Added text-center and w-full
        main: "flex flex-col gap-[32px] row-start-2 items-center sm:items-start",
        buttonGroup: "flex justify-center w-full", // Added justify-center and w-full
        inputContainer: "flex gap-[32px] row-start-2 items-center sm:items-start ",
        form: "max-w-sm mx-auto",
        label: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        footer: "row-start-3 flex gap-[24px] flex-wrap items-center justify-center",
        button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>Battleship</p>
            <main className={styles.main}>
                <div className={styles.buttonGroup}>
                    {newGame && (
                        <button className={styles.button} onClick={() => showStartGame()}>
                            New Game
                        </button>
                    )}
                    {startGame && (
                        <button className={styles.button}>
                            Start Game
                        </button>
                    )}
                </div>
                
                {startGame && <div className={styles.inputContainer}>
                    <form className={styles.form} >
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
                    <form className={styles.form} >
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
                </div>}
            </main>
            <footer className={styles.footer}></footer>
        </div>
    );
}