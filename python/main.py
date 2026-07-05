"""
============================================================================
PROJECT: Minefield Game (Python Edition)
DESCRIPTON: Zero-dependency command-line game loop. Because Python integers 
            have arbitrary precision, a bitwise mask (& 0xFFFFFFFFFFFFFFFF) 
            is manually evaluated on the LCG state to simulate standard 
            64-bit integer overflow.
============================================================================
HOW TO RUN:

[ Linux & macOS ]
  1. Run the script:           `python3 main.py`

[ Windows ]
  1. Run the script:           `python main.py`
============================================================================
"""

import time

ROWS = 8
COLS = 12

class Lcg:
    def __init__(self):
        self.state = time.time_ns() & 0xFFFFFFFFFFFFFFFF

    def next_u64(self):
        self.state = (self.state * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
        return self.state

    def random_range(self, min_val, max_val):
        val_range = max_val - min_val
        if val_range == 0:
            return min_val
        return min_val + (self.next_u64() % val_range)


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.has_mine = False


def print_game(phase, player_pos):
    game_str = []
    for r in range(ROWS):
        row_str = []
        for c in range(COLS):
            if (r, c) == player_pos:
                row_str.append(f"{phase} ")
            else:
                row_str.append(". ")
        game_str.append("".join(row_str))
    print("\n".join(game_str))


def main():
    mine_count = 5
    game_field = [[Point(c, r) for c in range(COLS)] for r in range(ROWS)]
    
    rng = Lcg()
    placed_mines = 0
    
    while placed_mines < mine_count:
        x = rng.random_range(0, ROWS)
        y = rng.random_range(0, COLS)
        
        if not game_field[x][y].has_mine:
            game_field[x][y].has_mine = True
            placed_mines += 1

    player_pos = (0, COLS // 2)
    current_phase = 'v'
    has_lost = False

    print_game(current_phase, player_pos)

    while player_pos[0] != ROWS:
        print("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right")
        user_input = input()
        
        if not user_input:
            continue
            
        decision = user_input[0].lower()
        r, c = player_pos

        if decision == 'a':
            current_phase = '<'
            if c > 0:
                c -= 1
            else:
                print("Ouch! You hit the left wall.")
        elif decision == 's':
            current_phase = 'v'
            r += 1
        elif decision == 'd':
            current_phase = '>'
            if c < COLS - 1:
                c += 1
            else:
                print("Ouch! You hit the right wall.")
        elif decision == 'w':
            current_phase = '^'
            if r > 0:
                r -= 1
            else:
                print("Ouch! You hit the ceiling.")
        else:
            continue

        player_pos = (r, c)
        print_game(current_phase, player_pos)

        if player_pos[0] < ROWS and player_pos[1] < COLS:
            if game_field[player_pos[0]][player_pos[1]].has_mine:
                print("Uh Oh!\nYou've lost by running into a mine!")
                has_lost = True
                break

    if not has_lost:
        print("\n===================================")
        print("    Congratulations, you won!")
        print("===================================")


if __name__ == "__main__":
    main()
