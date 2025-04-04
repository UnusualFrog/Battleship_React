'use client';
import { useState } from "react";
import { useRef, useEffect } from "react";

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DraggableShip from "./components/DraggableShip";
import Grid from "./components/Grid";

export default function Home() {
    // grid size
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);

    // ship placements
    const [ships, setShips] = useState([]);

    // ship counts
    const [destroyerCount, setDestroyerCount] = useState(1);
    const [submarineCount, setSubmarineCount] = useState(1);
    const [cruiserCount, setCruiserCount] = useState(1);
    const [battleshipCount, setBattleshipCount] = useState(1);
    const [carrierCount, setCarrierCount] = useState(1);

    const destroyerCountRef = useRef(destroyerCount);
    const submarineCountRef = useRef(submarineCount);
    const cruiserCountRef = useRef(cruiserCount);
    const battleshipCountRef = useRef(battleshipCount);
    const carrierCountRef = useRef(carrierCount);

    // Keep the count refs updated whenever a count state changes
    useEffect(() => {
        destroyerCountRef.current = destroyerCount;
        submarineCountRef.current = cruiserCount;
        cruiserCountRef.current = cruiserCount;
        battleshipCountRef.current = battleshipCount;
        carrierCountRef.current = carrierCount;
    }, [destroyerCount]);

    const onDrop = (item, row, col) => {
        debugger
        
        setShips((prevShips) => {
            switch (item.name) {
                case "Destroyer":
                    if ((prevShips.filter(x => x.name == "Destroyer").length) < destroyerCountRef.current) {
                        console.log(prevShips.filter(x => x.name == "Destroyer").length)
                        return [...prevShips, { ...item, row, col }];
                    }
                    return prevShips;
                case "Submarine":
                    if ((prevShips.filter(x => x.name == "Submarine").length) < destroyerCountRef.current) {
                        console.log(prevShips.filter(x => x.name == "Submarine").length)
                        return [...prevShips, { ...item, row, col }];
                    }
                    return prevShips;
                case "Cruiser":
                    if ((prevShips.filter(x => x.name == "Cruiser").length) < destroyerCountRef.current) {
                        console.log(prevShips.filter(x => x.name == "Cruiser").length)
                        return [...prevShips, { ...item, row, col }];
                    }
                    return prevShips;
                case "Battleship":
                    if ((prevShips.filter(x => x.name == "Battleship").length) < destroyerCountRef.current) {
                        console.log(prevShips.filter(x => x.name == "Battleship").length)
                        return [...prevShips, { ...item, row, col }];
                    }
                    return prevShips;
                case "Carrier":
                    if ((prevShips.filter(x => x.name == "Carrier").length) < destroyerCountRef.current) {
                        console.log(prevShips.filter(x => x.name == "Carrier").length)
                        return [...prevShips, { ...item, row, col }];
                    }
                    return prevShips;
                default:
                    return prevShips;
            }
        });
    };


    // Control visibility of buttons
    const [newGame, setNewGame] = useState(true);
    const [startGame, setStartGame] = useState(false);

    const showStartGame = () => {
        setNewGame((prev) => !prev);
        setStartGame((prev) => !prev);
    };

    const resetGame = () => {
        setShips([]);
    };

    const styles = {
        container: "flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-black text-white",
        title: "text-5xl text-center w-full mb-4",
        main: "flex flex-col gap-6 items-center w-full",
        buttonGroup: "flex justify-center w-full gap-4",
        inputContainer: "flex flex-wrap gap-4 justify-center w-full pb-6",
        form: "flex flex-col items-center",
        label: "block mb-2 text-sm font-medium text-gray-300",
        input: "bg-gray-800 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-20",
        shipsContainer: "flex flex-wrap gap-6 justify-center w-full pb-6",
        button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    };

    console.log("RENDER: destroyerCount is", destroyerCount);
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
                            <>
                                <button className={styles.button} onClick={resetGame}>
                                    Reset Ships
                                </button>
                                <button className={styles.button}>
                                    Start Game
                                </button>
                            </>
                        )}
                    </div>

                    {startGame && (
                        <div className="w-full flex flex-col items-center">
                            {/* Grid inputs */}
                            <div className={styles.inputContainer}>
                                <div className={styles.form}>
                                    <label htmlFor="rows-input" className={styles.label}>Grid Rows:</label>
                                    <input
                                        type="number"
                                        id="rows-input"
                                        placeholder="10"
                                        value={rows}
                                        min="5"
                                        max="15"
                                        required
                                        onChange={(e) => {
                                            setRows(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.form}>
                                    <label htmlFor="cols-input" className={styles.label}>Grid Cols:</label>
                                    <input
                                        type="number"
                                        id="cols-input"
                                        placeholder="10"
                                        value={cols}
                                        min="5"
                                        max="15"
                                        required
                                        onChange={(e) => {
                                            setCols(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            {/* Ship count inputs */}
                            <div className={styles.inputContainer}>
                                <div className={styles.form}>
                                    <label htmlFor="destroyer-count" className={styles.label}>Destroyers:</label>
                                    <input
                                        type="number"
                                        id="destroyer-count"
                                        placeholder="1"
                                        value={destroyerCount}
                                        min="0"
                                        max="4"
                                        required
                                        onChange={(e) => {
                                            setDestroyerCount(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.form}>
                                    <label htmlFor="submarine-count" className={styles.label}>Submarines:</label>
                                    <input
                                        type="number"
                                        id="submarine-count"
                                        placeholder="1"
                                        value={submarineCount}
                                        min="0"
                                        max="4"
                                        required
                                        onChange={(e) => {
                                            setSubmarineCount(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.form}>
                                    <label htmlFor="cruiser-count" className={styles.label}>Cruisers:</label>
                                    <input
                                        type="number"
                                        id="cruiser-count"
                                        placeholder="1"
                                        value={cruiserCount}
                                        min="0"
                                        max="4"
                                        required
                                        onChange={(e) => {
                                            setCruiserCount(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.form}>
                                    <label htmlFor="battleship-count" className={styles.label}>Battleships:</label>
                                    <input
                                        type="number"
                                        id="battleship-count"
                                        placeholder="1"
                                        value={battleshipCount}
                                        min="0"
                                        max="4"
                                        required
                                        onChange={(e) => {
                                            setBattleshipCount(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.form}>
                                    <label htmlFor="carrier-count" className={styles.label}>Carriers:</label>
                                    <input
                                        type="number"
                                        id="carrier-count"
                                        placeholder="1"
                                        value={carrierCount}
                                        min="0"
                                        max="4"
                                        required
                                        onChange={(e) => {
                                            setCarrierCount(Number(e.target.value));
                                            setShips([]);
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            {/* Show draggable ships */}
                            <div className={styles.shipsContainer}>
                                {destroyerCount > 0 && <DraggableShip name="Destroyer" />}
                                {submarineCount > 0 && <DraggableShip name="Submarine" />}
                                {cruiserCount > 0 && <DraggableShip name="Cruiser" />}
                                {battleshipCount > 0 && <DraggableShip name="Battleship" />}
                                {carrierCount > 0 && <DraggableShip name="Carrier" />}
                            </div>

                            {/* Game Board */}
                            <Grid
                                rows={rows}
                                cols={cols}
                                onDrop={onDrop} // <- this must point to the latest onDrop
                                ships={ships}
                            />
                        </div>
                    )}
                </main>
            </div>
        </DndProvider>
    );
}