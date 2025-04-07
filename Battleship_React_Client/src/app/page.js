'use client';
import { useState } from "react";
import { useRef, useEffect } from "react";

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DraggableShip from "./components/DraggableShip";
import Grid from "./components/Grid";

export default function Home() {
    // grid size
    const [gridRows, setGridRows] = useState(10);
    const [gridCols, setGridCols] = useState(10);

    const gridRowsRef = useRef(gridRows);
    const gridColsRef = useRef(gridCols);

    // ship data
    const [ships, setShips] = useState([]);
    const [shipLocations, setShipLocations] = useState([]);

    const shipLocationsRef = useRef(shipLocations);

    // fleet max counts
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

    // Keep the grid size and count refs updated whenever a count state changes
    useEffect(() => {
        gridRowsRef.current = gridRows;
        gridColsRef.current = gridCols;
        destroyerCountRef.current = destroyerCount;
        submarineCountRef.current = submarineCount;
        cruiserCountRef.current = cruiserCount;
        battleshipCountRef.current = battleshipCount;
        carrierCountRef.current = carrierCount;
        shipLocationsRef.current = shipLocations;
    }, [gridRows, gridCols, destroyerCount, submarineCount, cruiserCount, battleshipCount, carrierCount, shipLocations]);

    // Handle dropping of ship onto grid
    const onDrop = (item, row, col) => {
        var startRow = null;
        var endRow = null;
        var startCol = null;
        var endCol = null;

        // Set start and end values of ship
        if (item.isHorizontal) {
            startRow = row;
            startCol = col - item.draggedIndex;
            endRow = row;
            endCol = startCol + item.size - 1;
        } else {
            startRow = row - item.draggedIndex;
            startCol = col;
            endRow = startRow + item.size - 1;
            endCol = col;
        }

        // Check if ship is within bounds
        if (item.isHorizontal) {
            if (!((startCol >= 0) && (endCol <= gridColsRef.current - 1))) {
                return;
            }
        } else {
            if (!((startRow >= 0) && (endRow <= gridRowsRef.current - 1))) {
                return;
            }
        }

        // Check for overlapping ships
        debugger
        for (let ship of shipLocationsRef.current) {
            if (ship.item.isHorizontal) {
                if (item.isHorizontal) {
                    // Horizontal vs Horizontal collision check
                    if (startRow == ship.startRow && ((startCol >= ship.startCol && startCol <= ship.endCol) || 
                        (endCol >= ship.startCol && endCol <= ship.endCol) ||
                        (startCol <= ship.startCol && endCol >= ship.endCol))) {
                        return;
                    }
                } 
                else {
                    // Horizontal vs Vertical collision check
                    if (startCol >= ship.startCol && startCol <= ship.endCol &&
                        ship.startRow >= startRow && ship.startRow <= endRow) {
                        return;
                    }
                }
            } 
            else {
                if (item.isHorizontal) {
                    // Vertical vs Horizontal collision check
                    if (startRow >= ship.startRow && startRow <= ship.endRow &&
                        ship.startCol >= startCol && ship.startCol <= endCol) {
                        return;
                    }
                } 
                else {
                    // Vertical vs Vertical collision check
                    if (startCol == ship.startCol && ((startRow >= ship.startRow && startRow <= ship.endRow) || 
                        (endRow >= ship.startRow && endRow <= ship.endRow) ||
                        (startRow <= ship.startRow && endRow >= ship.endRow))) {
                        return;
                    }
                }
            }
        }



    setShipLocations((prevLocations) => {
        return [...prevLocations, { item, startRow, endRow, startCol, endCol}]
    })


    setShips((prevShips) => {
        switch (item.name) {
            case "Destroyer":
                if ((prevShips.filter(x => x.name == "Destroyer").length) < destroyerCountRef.current) {
                    return [...prevShips, { ...item, row, col }];
                }
                return prevShips;
            case "Submarine":
                if ((prevShips.filter(x => x.name == "Submarine").length) < submarineCountRef.current) {
                    return [...prevShips, { ...item, row, col }];
                }
                return prevShips;
            case "Cruiser":
                if ((prevShips.filter(x => x.name == "Cruiser").length) < cruiserCountRef.current) {
                    return [...prevShips, { ...item, row, col }];
                }
                return prevShips;
            case "Battleship":
                if ((prevShips.filter(x => x.name == "Battleship").length) < battleshipCountRef.current) {
                    return [...prevShips, { ...item, row, col }];
                }
                return prevShips;
            case "Carrier":
                if ((prevShips.filter(x => x.name == "Carrier").length) < carrierCountRef.current) {
                    return [...prevShips, { ...item, row, col }];
                }
                return prevShips;
            default:
                return prevShips;
        }
    });
};


// Control game state
const [newGame, setNewGame] = useState(true);
const [startGame, setStartGame] = useState(false);

// Toggle visibility of buttons
const showStartGame = () => {
    setNewGame((prev) => !prev);
    setStartGame((prev) => !prev);
};

// Clear all ship data
const resetGame = () => {
    setShips([]);
    setShipLocations([]);
};

// Styling classes
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
    shipGroup: "flex flex-col items-center gap-2 mx-2",
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
                                    value={gridRows}
                                    min="5"
                                    max="15"
                                    required
                                    onChange={(e) => {
                                        setGridRows(Number(e.target.value));
                                        setShips([]);
                                        setShipLocations([]);
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
                                    value={gridCols}
                                    min="5"
                                    max="15"
                                    required
                                    onChange={(e) => {
                                        setGridCols(Number(e.target.value));
                                        setShips([]);
                                        setShipLocations([]);
                                    }}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        {/* Ship selectors and ships aligned together */}
                        <div className={styles.shipsContainer}>
                            {/* Destroyer Group */}
                            {destroyerCount > 0 && (
                                <div className={styles.shipGroup}>
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
                                                setShipLocations([]);
                                            }}
                                            className={styles.input}
                                        />
                                    </div>
                                    <DraggableShip name="Destroyer" />
                                </div>
                            )}

                            {/* Submarine Group */}
                            {submarineCount > 0 && (
                                <div className={styles.shipGroup}>
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
                                                setShipLocations([]);
                                            }}
                                            className={styles.input}
                                        />
                                    </div>
                                    <DraggableShip name="Submarine" />
                                </div>
                            )}

                            {/* Cruiser Group */}
                            {cruiserCount > 0 && (
                                <div className={styles.shipGroup}>
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
                                                setShipLocations([]);
                                            }}
                                            className={styles.input}
                                        />
                                    </div>
                                    <DraggableShip name="Cruiser" />
                                </div>
                            )}

                            {/* Battleship Group */}
                            {battleshipCount > 0 && (
                                <div className={styles.shipGroup}>
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
                                                setShipLocations([]);
                                            }}
                                            className={styles.input}
                                        />
                                    </div>
                                    <DraggableShip name="Battleship" />
                                </div>
                            )}

                            {/* Carrier Group */}
                            {carrierCount > 0 && (
                                <div className={styles.shipGroup}>
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
                                                setShipLocations([]);
                                            }}
                                            className={styles.input}
                                        />
                                    </div>
                                    <DraggableShip name="Carrier" />
                                </div>
                            )}
                        </div>

                        {/* Game Board */}
                        <Grid
                            rows={gridRows}
                            cols={gridCols}
                            onDrop={onDrop}
                            ships={ships}
                        />
                    </div>
                )}
            </main>
        </div>
    </DndProvider>
);
}