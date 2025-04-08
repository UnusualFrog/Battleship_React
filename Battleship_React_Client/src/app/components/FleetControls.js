// components/FleetSelector.js
'use client';
import { useState } from 'react';
import DraggableShip from './DraggableShip';

export default function FleetControls({
    destroyerCount,
    submarineCount,
    cruiserCount,
    battleshipCount,
    carrierCount,
    onDestroyerCountChange,
    onSubmarineCountChange,
    onCruiserCountChange,
    onBattleshipCountChange,
    onCarrierCountChange,
    shipOrientations,
    onShipOrientationChange
}) {
    // Styling classes
    const styles = {
        shipsContainer: "flex flex-wrap gap-6 justify-center w-full pb-6",
        shipGroup: "flex flex-col items-center gap-2 mx-2",
        form: "flex flex-col items-center",
        label: "block mb-2 text-sm font-medium text-gray-300",
        input: "bg-gray-800 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-20",
    };

    // Reusable ship selector component to reduce repetition
    const ShipSelector = ({ name, count, maxCount, onChange, children }) => (
        <div className={styles.shipGroup}>
            <div className={styles.form}>
                <label htmlFor={`${name.toLowerCase()}-count`} className={styles.label}>
                    {name}s:
                </label>
                <input
                    type="number"
                    id={`${name.toLowerCase()}-count`}
                    placeholder="1"
                    value={count}
                    min="0"
                    max={maxCount}
                    required
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={styles.input}
                />
            </div>
            {count > 0 && children}
        </div>
    );

    return (
        <div className={styles.shipsContainer}>
            <ShipSelector
                name="Destroyer"
                count={destroyerCount}
                maxCount={4}
                onChange={onDestroyerCountChange}
            >
                <DraggableShip
                    name="Destroyer"
                    isHorizontal={shipOrientations.Destroyer}
                    onOrientationChange={(isHorizontal) =>
                        onShipOrientationChange("Destroyer", isHorizontal)
                    }
                />
            </ShipSelector>

            <ShipSelector
                name="Submarine"
                count={submarineCount}
                maxCount={4}
                onChange={onSubmarineCountChange}
            >
                <DraggableShip
                    name="Submarine"
                    isHorizontal={shipOrientations.Submarine}
                    onOrientationChange={(isHorizontal) =>
                        onShipOrientationChange("Submarine", isHorizontal)
                    }
                />
            </ShipSelector>

            <ShipSelector
                name="Cruiser"
                count={cruiserCount}
                maxCount={4}
                onChange={onCruiserCountChange}
            >
                <DraggableShip
                    name="Cruiser"
                    isHorizontal={shipOrientations.Cruiser}
                    onOrientationChange={(isHorizontal) =>
                        onShipOrientationChange("Cruiser", isHorizontal)
                    }
                />
            </ShipSelector>

            <ShipSelector
                name="Battleship"
                count={battleshipCount}
                maxCount={4}
                onChange={onBattleshipCountChange}
            >
                <DraggableShip
                    name="Battleship"
                    isHorizontal={shipOrientations.Battleship}
                    onOrientationChange={(isHorizontal) =>
                        onShipOrientationChange("Battleship", isHorizontal)
                    }
                />
            </ShipSelector>

            <ShipSelector
                name="Carrier"
                count={carrierCount}
                maxCount={4}
                onChange={onCarrierCountChange}
            >
                <DraggableShip
                    name="Carrier"
                    isHorizontal={shipOrientations.Carrier}
                    onOrientationChange={(isHorizontal) =>
                        onShipOrientationChange("Carrier", isHorizontal)
                    }
                />
            </ShipSelector>
        </div>
    );
}