/* ============================================================================
 * PROJECT: Minefield Game (Node.js JavaScript Edition)
 * DESCRIPTON: Uses native Node.js architectures. Standard numbers are floating
 * points, so `BigInt` (n literals) combined with a bitwise mask
 * forces 64-bit math. Terminal blocking loops are handled synchronously
 * via the core `fs.readSync` module.
 * ============================================================================
 * HOW TO RUN:
 * * [ Linux, macOS, & Windows ]
 * 1. Run the script:        `node main.js`
 * ============================================================================
 */

const fs = require("fs");

const ROWS = 8;
const COLS = 12;

class Lcg {
  constructor() {
    // process.hrtime.bigint() gives nanoseconds since arbitrary point
    this.state = process.hrtime.bigint() & 0xffffffffffffffffn;
  }

  nextU64() {
    this.state =
      (this.state * 6364136223846793005n + 1442695040888963407n) &
      0xffffffffffffffffn;
    return this.state;
  }

  randomRange(min, max) {
    const range = BigInt(max - min);
    if (range === 0n) return min;
    return min + Number(this.nextU64() % range);
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hasMine = false;
  }
}

function printGame(phase, playerRow, playerCol) {
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

function readLineSync() {
  const buffer = Buffer.alloc(1024);
  const bytesRead = fs.readSync(0, buffer, 0, 1024, null);
  return buffer.toString("utf8", 0, bytesRead).trim();
}

function main() {
  const mineCount = 5;
  const gameField = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => new Point(c, r)),
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

  let playerRow = 0;
  let playerCol = Math.floor(COLS / 2);
  let currentPhase = "v";
  let hasLost = false;

  printGame(currentPhase, playerRow, playerCol);

  while (playerRow !== ROWS) {
    console.log("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right");
    const input = readLineSync();
    if (input.length === 0) continue;

    const decision = input[0].toLowerCase();

    switch (decision) {
      case "a":
        currentPhase = "<";
        if (playerCol > 0) playerCol--;
        else console.log("Ouch! You hit the left wall.");
        break;
      case "s":
        currentPhase = "v";
        playerRow++;
        break;
      case "d":
        currentPhase = ">";
        if (playerCol < COLS - 1) playerCol++;
        else console.log("Ouch! You hit the right wall.");
        break;
      case "w":
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
