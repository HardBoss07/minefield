/* ============================================================================
 * PROJECT: Minefield Game (Java Edition)
 * DESCRIPTON: Uses standard Java 21+ idioms with a Scanner interface for
 * blocking system inputs. The LCG leverages JVM 64-bit signed long
 * primitives, which handle modular wrapping math naturally
 * on overflow via two's complement.
 * ============================================================================
 * HOW TO RUN:
 * * [ Linux, macOS, & Windows ]
 * 1. Navigate to directory: `cd java`
 * 2. Compile using javac:   `javac src/main/java/com/minefield/Main.java -d target/classes`
 * 3. Run the class file:    `java -cp target/classes com.minefield.Main`
 * ============================================================================
 */
package dev.m4tt3o.minefield;

import java.util.Scanner;

public class Main {
    private static final int ROWS = 8;
    private static final int COLS = 12;

    private record Point(int x, int y, boolean hasMine) {
        public Point withMine(boolean hasMine) {
            return new Point(this.x, this.y, hasMine);
        }
    }

    private static class Lcg {
        private long state;

        public Lcg() {
            this.state = System.nanoTime();
        }

        public long nextLong() {
            this.state = this.state * 6364136223846793005L + 1442695040888963407L;
            return this.state;
        }

        public int randomRange(int min, int max) {
            int range = max - min;
            if (range == 0) return min;
            return min + Math.abs((int) (nextLong() % range));
        }
    }

    public static void main(String[] args) {
        int mineCount = 5;
        Point[][] gameField = new Point[ROWS][COLS];

        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                gameField[r][c] = new Point(c, r, false);
            }
        }

        Lcg rng = new Lcg();
        int placedMines = 0;

        while (placedMines < mineCount) {
            int x = rng.randomRange(0, ROWS);
            int y = rng.randomRange(0, COLS);

            if (!gameField[x][y].hasMine()) {
                gameField[x][y] = gameField[x][y].withMine(true);
                placedMines++;
            }
        }

        int playerRow = 0;
        int playerCol = COLS / 2;
        char currentPhase = 'v';
        boolean hasLost = false;

        printGame(currentPhase, playerRow, playerCol);
        Scanner scanner = new Scanner(System.in);

        while (playerRow != ROWS) {
            System.out.println("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right");
            String input = scanner.nextLine();
            if (input.isEmpty()) continue;

            char decision = Character.toLowerCase(input.charAt(0));

            switch (decision) {
                case 'a' -> {
                    currentPhase = '<';
                    if (playerCol > 0) playerCol--;
                    else System.out.println("Ouch! You hit the left wall.");
                }
                case 's' -> {
                    currentPhase = 'v';
                    playerRow++;
                }
                case 'd' -> {
                    currentPhase = '>';
                    if (playerCol < COLS - 1) playerCol++;
                    else System.out.println("Ouch! You hit the right wall.");
                }
                case 'w' -> {
                    if (playerRow > 0) playerRow--;
                    else System.out.println("Ouch! You hit the ceiling.");
                }
                default -> {
                    continue;
                }
            }

            printGame(currentPhase, playerRow, playerCol);

            if (playerRow < ROWS && playerCol < COLS) {
                if (gameField[playerRow][playerCol].hasMine()) {
                    System.out.println("Uh Oh!\nYou've lost by running into a mine!");
                    hasLost = true;
                    break;
                }
            }
        }

        if (!hasLost) {
            System.out.println("\n===================================");
            System.out.println("    Congratulations, you won!");
            System.out.println("===================================");
        }

        scanner.close();
    }

    private static void printGame(char phase, int playerRow, int playerCol) {
        StringBuilder gameStr = new StringBuilder();
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (r == playerRow && c == playerCol) {
                    gameStr.append(phase).append(" ");
                } else {
                    gameStr.append(". ");
                }
            }
            gameStr.append("\n");
        }
        System.out.print(gameStr);
    }
}
