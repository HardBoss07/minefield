/* ============================================================================
 * PROJECT: Minefield Game (C Edition)
 * DESCRIPTON: Dependency-free terminal game leveraging the ISO C standard
 * library. Uses Knuth's MMIX LCG parameters. Standard unsigned 64-bit
 * integers automatically handle modulo wrapping on overflow.
 * ============================================================================
 * HOW TO RUN:
 * * [ Linux & macOS ]
 * 1. Compile:               `gcc -O2 main.c -o minefield`
 * 2. Execute:               `./minefield`
 * * [ Windows ]
 * 1. Compile:               `gcc -O2 main.c -o minefield.exe`
 * 2. Execute:               `.\minefield.exe`
 * ============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <time.h>
#include <ctype.h>
#include <stdint.h>

#define ROWS 8
#define COLS 12

typedef struct
{
    int x;
    int y;
    bool has_mine;
} Point;

typedef struct
{
    uint64_t state;
} Lcg;

Lcg lcg_new()
{
    Lcg lcg;
    lcg.state = (uint64_t)time(NULL);
    return lcg;
}

uint64_t lcg_next(Lcg *lcg)
{
    lcg->state = lcg->state * 6364136223846793005ULL + 1442695040888963407ULL;
    return lcg->state;
}

int lcg_random_range(Lcg *lcg, int min, int max)
{
    int range = max - min;
    if (range == 0)
        return min;
    return min + (int)(lcg_next(lcg) % range);
}

void print_game(char phase, int player_row, int player_col)
{
    for (int r = 0; r < ROWS; r++)
    {
        for (int c = 0; c < COLS; c++)
        {
            if (r == player_row && c == player_col)
            {
                printf("%c ", phase);
            }
            else
            {
                printf(". ");
            }
        }
        printf("\n");
    }
}

int main()
{
    int mine_count = 5;
    Point game_field[ROWS][COLS];

    for (int r = 0; r < ROWS; r++)
    {
        for (int c = 0; c < COLS; c++)
        {
            game_field[r][c].x = c;
            game_field[r][c].y = r;
            game_field[r][c].has_mine = false;
        }
    }

    Lcg rng = lcg_new();
    int placed_mines = 0;

    while (placed_mines < mine_count)
    {
        int x = lcg_random_range(&rng, 0, ROWS);
        int y = lcg_random_range(&rng, 0, COLS);

        if (!game_field[x][y].has_mine)
        {
            game_field[x][y].has_mine = true;
            placed_mines++;
        }
    }

    int player_row = 0;
    int player_col = COLS / 2;
    char current_phase = 'v';
    bool has_lost = false;

    print_game(current_phase, player_row, player_col);

    while (player_row != ROWS)
    {
        printf("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right\n");

        char input[10];
        if (fgets(input, sizeof(input), stdin) == NULL)
            continue;
        char decision = tolower(input[0]);

        switch (decision)
        {
        case 'a':
            current_phase = '<';
            if (player_col > 0)
                player_col--;
            else
                printf("Ouch! You hit the left wall.\n");
            break;
        case 's':
            current_phase = 'v';
            player_row++;
            break;
        case 'd':
            current_phase = '>';
            if (player_col < COLS - 1)
                player_col++;
            else
                printf("Ouch! You hit the right wall.\n");
            break;
        case 'w':
            if (player_row > 0)
                player_row--;
            else
                printf("Ouch! You hit the ceiling.\n");
            break;
        default:
            continue;
        }

        print_game(current_phase, player_row, player_col);

        if (player_row < ROWS && player_col < COLS)
        {
            if (game_field[player_row][player_col].has_mine)
            {
                printf("Uh Oh!\nYou've lost by running into a mine!\n");
                has_lost = true;
                break;
            }
        }
    }

    if (!has_lost)
    {
        printf("\n===================================\n");
        printf("    Congratulations, you won!\n");
        printf("===================================\n");
    }

    return 0;
}
