#include <iostream>
#include <vector>
#include <chrono>
#include <cctype>

const int ROWS = 8;
const int COLS = 12;

struct Point
{
    int x;
    int y;
    bool has_mine = false;
};

class Lcg
{
private:
    uint64_t state;

public:
    Lcg()
    {
        auto now = std::chrono::high_resolution_clock::now();
        state = std::chrono::duration_cast<std::chrono::nanoseconds>(now.time_since_epoch()).count();
    }

    uint64_t next_u64()
    {
        state = state * 6364136223846793005ULL + 1442695040888963407ULL;
        return state;
    }

    int random_range(int min, int max)
    {
        int range = max - min;
        if (range == 0)
            return min;
        return min + static_cast<int>(next_u64() % range);
    }
};

void print_game(char phase, int player_row, int player_col)
{
    for (int r = 0; r < ROWS; ++r)
    {
        for (int c = 0; c < COLS; ++c)
        {
            if (r == player_row && c == player_col)
            {
                std::cout << phase << " ";
            }
            else
            {
                std::cout << ". ";
            }
        }
        std::cout << "\n";
    }
}

int main()
{
    int mine_count = 5;
    std::vector<std::vector<Point>> game_field(ROWS, std::vector<Point>(COLS));

    for (int r = 0; r < ROWS; ++r)
    {
        for (int c = 0; c < COLS; ++c)
        {
            game_field[r][c].x = c;
            game_field[r][c].y = r;
        }
    }

    Lcg rng;
    int placed_mines = 0;
    while (placed_mines < mine_count)
    {
        int x = rng.random_range(0, ROWS);
        int y = rng.random_range(0, COLS);

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
        std::cout << "Make your move:\nW: Up\nA: Left\nS: Down\nD: Right\n";

        std::string input;
        if (!std::getline(std::cin, input))
            continue;
        if (input.empty())
            continue;

        char decision = std::tolower(input[0]);

        switch (decision)
        {
        case 'a':
            current_phase = '<';
            if (player_col > 0)
                player_col--;
            else
                std::cout << "Ouch! You hit the left wall.\n";
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
                std::cout << "Ouch! You hit the right wall.\n";
            break;
        case 'w':
            if (player_row > 0)
                player_row--;
            else
                std::cout << "Ouch! You hit the ceiling.\n";
            break;
        default:
            continue;
        }

        print_game(current_phase, player_row, player_col);

        if (player_row < ROWS && player_col < COLS)
        {
            if (game_field[player_row][player_col].has_mine)
            {
                std::cout << "Uh Oh!\nYou've lost by running into a mine!\n";
                has_lost = true;
                break;
            }
        }
    }

    if (!has_lost)
    {
        std::cout << "\n===================================\n";
        std::cout << "    Congratulations, you won!\n";
        std::cout << "===================================\n";
    }

    return 0;
}