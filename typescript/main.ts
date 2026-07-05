/* ============================================================================
 * PROJECT: Minefield Game (Node.js TypeScript Edition)
 * DESCRIPTON: Enhances the Node.js implementation with explicit structural 
 * interfaces and strict type parameters without requiring build configurations.
 * ============================================================================
 * HOW TO RUN:
 * * [ Linux, macOS, & Windows ]
 * 1. Run with tsx:          `npx tsx main.ts`
 * 2. Or run with ts-node:   `npx ts-node main.ts`
 * ============================================================================
 */

import * as fs from 'fs';

const ROWS: number = 8;
const COLS: number = 12;

class Lcg {
    private state: bigint;

    constructor() {
        this.state = process.hrtime.bigint() & 0xFFFFFFFFFFFFFFFFn;
    }

    private nextU64(): bigint {
        this.state = (this.state * 6364136223846793005n + 1442695040888963407n) & 0xFFFFFFFFFFFFFFFFn;
        return this.state;
    }

    public randomRange(min: number, max: number): number {
        const range = BigInt(max - min);
        if (range === 0n) return min;
        return min + Number(this.nextU64() % range);
    }
}

interface IPoint {
    x: number;
    y: number;
    hasMine: boolean;
}

class Point implements IPoint {
    public x: number;
    public y: number;
    public hasMine: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function printGame(phase: string, playerRow: number, playerCol: number): void {
    let gameStr = "";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (r === playerRow && c === playerCol) {
                gameStr += phase + " ";
            } else {
                gameStr += ". ";
            }
        }
        gameStr += "\n";
    }
    process.stdout.write(gameStr);
}

function readLineSync(): string {
    const buffer = Buffer.alloc(1024);
    const bytesRead = fs.readSync(0, buffer, 0, 1024, null);
    return buffer.toString('utf8', 0, bytesRead).trim();
}

function main(): void {
    const mineCount = 5;
    const gameField: Point[][] = Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => new Point(c, r))
    );

    const rng = new Lcg();
    let placedMines = 0;

    while (placedMines < mineCount) {
        const x = rng.randomRange(0, ROWS);
        const y = rng.randomRange(0, COLS);

        if (!gameField[x][y].hasMine) {
            gameField[x][y].hasMine = true;
            placedMines++;
        }
    }

    let playerRow: number = 0;
    let playerCol: number = Math.floor(COLS / 2);
    let currentPhase: string = 'v';
    let hasLost: boolean = false;

    printGame(currentPhase, playerRow, playerCol);

    while (playerRow !== ROWS) {
        console.log("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right");
        const input = readLineSync();
        if (input.length === 0) continue;

        const decision = input[0].toLowerCase();

        switch (decision) {
            case 'a':
                currentPhase = '<';
                if (playerCol > 0) playerCol--;
                else console.log("Ouch! You hit the left wall.");
                break;
            case 's':
                currentPhase = 'v';
                playerRow++;
                break;
            case 'd':
                currentPhase = '>';
                if (playerCol < COLS - 1) playerCol++;
                else console.log("Ouch! You hit the right wall.");
                break;
            case 'w':
                if (playerRow > 0) playerRow--;
                else console.log("Ouch! You hit the ceiling.");
                break;
            default:
                continue;
        }

        printGame(currentPhase, playerRow, playerCol);

        if (playerRow < ROWS && playerCol < COLS) {
            if (gameField[playerRow][playerCol].hasMine) {
                console.log("Uh Oh!\nYou've lost by running into a mine!");
                hasLost = true;
                break;
            }
        }
    }

    if (!hasLost) {
        console.log("\n===================================");
        console.log("    Congratulations, you won!");
        console.log("===================================");
    }
}

main();
