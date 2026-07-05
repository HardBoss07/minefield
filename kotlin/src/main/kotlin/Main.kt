/* ============================================================================
 * PROJECT: Minefield Game (Kotlin Edition)
 * DESCRIPTON: Uses modern Kotlin conventions including null-safe terminal input,
 * top-level script blocks, explicit `when` control blocks,
 * and inline functional loop constructors.
 * ============================================================================
 * HOW TO RUN:
 * * [ Linux, macOS, & Windows ]
 * 1. Navigate to directory: `cd kotlin`
 * 2. Compile with kotlinc:  `kotlinc src/main/kotlin/Main.kt -include-runtime -d target/minefield.jar`
 * 3. Run the compiled jar:  `java -jar target/minefield.jar`
 * ============================================================================
 */
package dev.m4tt3o.minefield.kotlin;

import kotlin.math.abs

const val ROWS = 8
const val COLS = 12

data class Point(val x: Int, val y: Int, var hasMine: Boolean = false)

class Lcg {
    private var state: Long = System.nanoTime()

    fun nextLong(): Long {
        state = state * 6364136223846793005L + 1442695040888963407L
        return state
    }

    fun randomRange(min: Int, max: Int): Int {
        val range = max - min
        if (range == 0) return min
        return min + abs((nextLong() % range).toInt())
    }
}

fun printGame(phase: Char, playerRow: Int, playerCol: Int) {
    val gameStr = StringBuilder()
    for (r in 0 until ROWS) {
        for (c in 0 until COLS) {
            if (r == playerRow && c == playerCol) {
                gameStr.append("$phase ")
            } else {
                gameStr.append(". ")
            }
        }
        gameStr.append("\n")
    }
    print(gameStr)
}

fun main() {
    val mineCount = 5
    val gameField = Array(ROWS) { r ->
        Array(COLS) { c -> Point(c, r) }
    }

    val rng = Lcg()
    var placedMines = 0

    while (placedMines < mineCount) {
        val x = rng.randomRange(0, ROWS)
        val y = rng.randomRange(0, COLS)

        if (!gameField[x][y].hasMine) {
            gameField[x][y].hasMine = true
            placedMines++
        }
    }

    var playerRow = 0
    var playerCol = COLS / 2
    var currentPhase = 'v'
    var hasLost = false

    printGame(currentPhase, playerRow, playerCol)

    while (playerRow != ROWS) {
        println("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right")
        val input = readlnOrNull() ?: continue
        if (input.isEmpty()) continue

        val decision = input[0].lowercaseChar()

        when (decision) {
            'a' -> {
                currentPhase = '<'
                if (playerCol > 0) playerCol-- else println("Ouch! You hit the left wall.")
            }

            's' -> {
                currentPhase = 'v'
                playerRow++
            }

            'd' -> {
                currentPhase = '>'
                if (playerCol < COLS - 1) playerCol++ else println("Ouch! You hit the right wall.")
            }

            'w' -> {
                if (playerRow > 0) playerRow-- else println("Ouch! You hit the ceiling.")
            }

            else -> continue
        }

        printGame(currentPhase, playerRow, playerCol)

        if (playerRow < ROWS && playerCol < COLS) {
            if (gameField[playerRow][playerCol].hasMine) {
                println("Uh Oh!\nYou've lost by running into a mine!")
                hasLost = true
                break
            }
        }
    }

    if (!hasLost) {
        println("\n===================================")
        println("    Congratulations, you won!")
        println("===================================")
    }
}
