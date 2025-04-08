'use client';

// React imports
import { useState } from "react";
import { useRef, useEffect } from "react";

// External frameworks
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Import custom components
import Grid from "./components/Grid";
import ShipControls from "./components/ShipControls";
import FleetControls from "./components/FleetControls";
import GameControls from "./components/GameControls";


export default function Home() {
    // grid dimensions
    const [gridRows, setGridRows] = useState(10);
    const [gridCols, setGridCols] = useState(10);
    const gridRowsRef = useRef(gridRows);
    const gridColsRef = useRef(gridCols);

    // ship data and ship location data
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

    // Track orientation of the ship controls
    const [shipOrientations, setShipOrientations] = useState({
        Destroyer: true,
        Submarine: true,
        Cruiser: true,
        Battleship: true,
        Carrier: true
    });

    const handleOrientationChange = (shipType, isHorizontal) => {
        setShipOrientations(prev => ({
            ...prev,
            [shipType]: isHorizontal
        }));
    };

    // Keep the grid size and ship count refs updated whenever their states change
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

    // Control game state
    const [newGame, setNewGame] = useState(true);
    const [startGame, setStartGame] = useState(false);

    // Clear all ship data
    const resetGame = () => {
        setShips([]);
        setShipLocations([]);
    };

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

        // Add new ship's location to ship location data
        setShipLocations((prevLocations) => {
            return [...prevLocations, { item, startRow, endRow, startCol, endCol }]
        })

        // Add new ship to ship data
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

    // Styling classes
    const styles = {
        container: "flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-black text-white",
        title: "text-5xl text-center w-full mb-4",
        main: "flex flex-col gap-6 items-center w-full",
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.container}>
                <p className={styles.title}>Battleship</p>
                <main className={styles.main}>
                    <GameControls
                        newGame={newGame}
                        startGame={startGame}
                        onNewGame={() => {
                            setNewGame(false);
                            setStartGame(true);
                        }}
                        onResetShips={resetGame}
                        onStartGame={() => {
                            // Implement what happens when starting the game
                            console.log("Starting game with ships:", ships);
                            // You could add state transitions here
                        }}
                    />

                    {startGame && (
                        <div className="w-full flex flex-col items-center">
                            <ShipControls
                                gridRows={gridRows}
                                gridCols={gridCols}
                                onGridRowsChange={(rows) => {
                                    setGridRows(rows);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                                onGridColsChange={(cols) => {
                                    setGridCols(cols);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                            />

                            <FleetControls
                                destroyerCount={destroyerCount}
                                submarineCount={submarineCount}
                                cruiserCount={cruiserCount}
                                battleshipCount={battleshipCount}
                                carrierCount={carrierCount}
                                onDestroyerCountChange={(count) => {
                                    setDestroyerCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                                onSubmarineCountChange={(count) => {
                                    setSubmarineCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                                onCruiserCountChange={(count) => {
                                    setCruiserCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                                onBattleshipCountChange={(count) => {
                                    setBattleshipCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                                onCarrierCountChange={(count) => {
                                    setCarrierCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                }}
                                shipOrientations={shipOrientations}
                                onShipOrientationChange={handleOrientationChange}
                            />

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