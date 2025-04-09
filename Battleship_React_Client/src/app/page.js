'use client';

// React imports
import { useState } from "react";
import { useRef, useEffect } from "react";

// External frameworks
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Import custom components
import Grid from "./components/Grid";
import GridControls from "./components/GridControls";
import FleetControls from "./components/FleetControls";
import GameControls from "./components/GameControls";
import Output from "./components/Output";


export default function Home() {
    // Grid row and column dimensions
    const [gridRows, setGridRows] = useState(10);
    const [gridCols, setGridCols] = useState(10);
    const gridRowsRef = useRef(gridRows);
    const gridColsRef = useRef(gridCols);

    // Ship data and ship location data
    const [ships, setShips] = useState([]);
    const [shipLocations, setShipLocations] = useState([]);
    const shipLocationsRef = useRef(shipLocations);

    // Max number of each ship type
    const [destroyerCount, setDestroyerCount] = useState(1);
    const [submarineCount, setSubmarineCount] = useState(1);
    const [cruiserCount, setCruiserCount] = useState(1);
    const [battleshipCount, setBattleshipCount] = useState(1);
    const [carrierCount, setCarrierCount] = useState(1);

    // Reference variable for updating state changes
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

    // Invert orientation of ship controls
    const handleOrientationChange = (shipType, isHorizontal) => {
        setShipOrientations(prev => ({
            ...prev,
            [shipType]: isHorizontal
        }));
    };

    // Keep the grid size and ship count reference variables updated whenever their states change
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

    // Add state for messages
    const [gameMessages, setGameMessages] = useState([]);

    // Function to add messages
    const addMessage = (text, type = 'info') => {
        setGameMessages(prevMessages => [
            ...prevMessages,
            {
                text,
                type,
                timestamp: new Date().toLocaleTimeString('en-GB', { hour12: true })
            }
        ]);
    };

    // Control game state
    const [gameState, setGameState] = useState("newGame");

    // Clear all ship data and ship location data
    const resetShips = () => {
        setShips([]);
        setShipLocations([]);
        addMessage(`Ships Reset`);
    };

    

    {/* Handle dropping of ship onto grid
    Checks for overlapping ships and out-of-bounds placement
    Updates ship data and ship location data on success*/}
    const onDrop = (item, row, col) => {
        debugger
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
                addMessage(`Cannot place ${item.name} - out of bounds!`, 'error');
                return;
            }
        } else {
            if (!((startRow >= 0) && (endRow <= gridRowsRef.current - 1))) {
                addMessage(`Cannot place ${item.name} - out of bounds!`, 'error');
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
                        addMessage(`Cannot place ${item.name} - ship overlaps ${ship.item.name}!`, 'error');
                        return;
                    }
                }
                else {
                    // Horizontal vs Vertical collision check
                    if (startCol >= ship.startCol && startCol <= ship.endCol &&
                        ship.startRow >= startRow && ship.startRow <= endRow) {
                        addMessage(`Cannot place ${item.name} - ship overlaps ${ship.item.name}!`, 'error');
                        return;
                    }
                }
            }
            else {
                if (item.isHorizontal) {
                    // Vertical vs Horizontal collision check
                    if (startRow >= ship.startRow && startRow <= ship.endRow &&
                        ship.startCol >= startCol && ship.startCol <= endCol) {
                        addMessage(`Cannot place ${item.name} - ship overlaps ${ship.item.name}!`, 'error');
                        return;
                    }
                }
                else {
                    // Vertical vs Vertical collision check
                    if (startCol == ship.startCol && ((startRow >= ship.startRow && startRow <= ship.endRow) ||
                        (endRow >= ship.startRow && endRow <= ship.endRow) ||
                        (startRow <= ship.startRow && endRow >= ship.endRow))) {
                        addMessage(`Cannot place ${item.name} - ship overlaps ${ship.item.name}!`, 'error');
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
                        addMessage(`Successfully placed ${item.name}`, 'success');
                        return [...prevShips, { ...item, row, col }];
                    }
                    addMessage(`Cannot Place ${item.name}, max capacity of ${destroyerCountRef.current} reached`, 'error');
                    return prevShips;
                case "Submarine":
                    if ((prevShips.filter(x => x.name == "Submarine").length) < submarineCountRef.current) {
                        addMessage(`Successfully placed ${item.name}`, 'success');
                        return [...prevShips, { ...item, row, col }];
                    }
                    addMessage(`Cannot Place ${item.name}, max capacity of ${submarineCountRef.current} reached`, 'error');
                    return prevShips;
                case "Cruiser":
                    if ((prevShips.filter(x => x.name == "Cruiser").length) < cruiserCountRef.current) {
                        addMessage(`Successfully placed ${item.name}`, 'success');
                        return [...prevShips, { ...item, row, col }];
                    }
                    addMessage(`Cannot Place ${item.name}, max capacity of ${cruiserCountRef.current} reached`, 'error');
                    return prevShips;
                case "Battleship":
                    if ((prevShips.filter(x => x.name == "Battleship").length) < battleshipCountRef.current) {
                        addMessage(`Successfully placed ${item.name}`, 'success');
                        return [...prevShips, { ...item, row, col }];
                    }
                    addMessage(`Cannot Place ${item.name}, max capacity of ${battleshipCountRef.current} reached`, 'error');
                    return prevShips;
                case "Carrier":
                    if ((prevShips.filter(x => x.name == "Carrier").length) < carrierCountRef.current) {
                        addMessage(`Successfully placed ${item.name}`, 'success');
                        return [...prevShips, { ...item, row, col }];
                    }
                    addMessage(`Cannot Place ${item.name}, max capacity of ${carrierCountRef.current} reached`, 'error');
                    return prevShips;
                default:
                    return prevShips;
            }
        });
    };

    // Classes for Tailwind css styling
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
                    {/* Controls for managing game state */}
                    <GameControls
                        gameState={gameState}
                        onNewGame={() => {
                            setGameState("startGame")
                        }}
                        onResetShips={resetShips}
                        onStartGame={() => {
                            // TODO add check for current ships == max ships to ensure all ships placed
                            setGameState("activeGame")
                            addMessage(`Game Started`);
                        }}
                    />

                    {gameState == "startGame" && (
                        <div className="w-full flex flex-col items-center">
                            {/* Controls size of grid */}
                            <GridControls
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

                            {/* Controls ship counts and rendering of draggable ships */}
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
                                    addMessage(`Destroyer count set to ${count}, ships reset`);
                                }}
                                onSubmarineCountChange={(count) => {
                                    setSubmarineCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                    addMessage(`Submarine count set to ${count}, ships reset`);
                                }}
                                onCruiserCountChange={(count) => {
                                    setCruiserCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                    addMessage(`Cruiser count set to ${count}, ships reset`);
                                }}
                                onBattleshipCountChange={(count) => {
                                    setBattleshipCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                    addMessage(`Battleship count set to ${count}, ships reset`);
                                }}
                                onCarrierCountChange={(count) => {
                                    setCarrierCount(count);
                                    setShips([]);
                                    setShipLocations([]);
                                    addMessage(`Carrier count set to ${count}, ships reset`);
                                }}
                                shipOrientations={shipOrientations}
                                onShipOrientationChange={handleOrientationChange}
                            />


                        </div>
                    )}

                    {/* Player and Opponent Game Boards */}
                    <div className="flex flex-row gap-8">
                        {gameState !== "newGame" && (
                            <Grid
                                rows={gridRows}
                                cols={gridCols}
                                onDrop={onDrop}
                                ships={ships}
                                owner="Player"
                            />
                        )}
                        {gameState === "activeGame" && (
                            <Grid
                                rows={gridRows}
                                cols={gridCols}
                                onDrop={onDrop}
                                ships={[]}
                                owner="Opponent"
                            />
                        )}
                    </div>
                    {/* Console output*/}
                    {gameState !== "newGame" && <div>
                        <Output gameMessages={gameMessages}/>
                    </div>}
                </main>
            </div>
        </DndProvider>
    );
}