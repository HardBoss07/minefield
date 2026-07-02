use rand::{Rng, RngExt};
use std::io::{self, Write};

#[derive(Debug, Clone, Copy)]
struct Point {
    x: usize,
    y: usize,
    has_mine: bool,
}

const ROWS: usize = 8;
const COLS: usize = 12;

fn main() {
    let _mine_count: usize = 0;

    let default_point = Point {
        x: 0,
        y: 0,
        has_mine: false,
    };

    let mut game_field: [[Point; COLS]; ROWS] = [[default_point; COLS]; ROWS];

    for row in 0..ROWS {
        for col in 0..COLS {
            game_field[row][col].x = col as usize;
            game_field[row][col].y = row as usize;
        }
    }

    let mines = mine_positions(_mine_count);

    for mine in mines {
        game_field[mine[0]][mine[1]].has_mine = true;
    }

    let mut player_pos: (usize, usize) = (0, COLS / 2);

    let player_phases = ('<', 'v', '>');
    let mut current_phase: char = 'v';

    print_game(&current_phase, &player_pos);

    let mut has_lost = false;

    while player_pos.0 != ROWS {
        let _ = io::stdout().flush();
        println!("Make your move:\nW: Up\nA: Left\nS: Down\nD: Right");
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");

        let decision = input.chars().next().unwrap_or(' ').to_ascii_lowercase();

        match decision {
            'a' => {
                current_phase = player_phases.0;
                if player_pos.1 > 0 {
                    player_pos.1 = player_pos.1 - 1;
                } else {
                    println!("Ouch! You hit the left wall.");
                }
            }
            's' => {
                current_phase = player_phases.1;
                player_pos.0 = player_pos.0 + 1;
            }
            'd' => {
                current_phase = player_phases.2;
                if player_pos.1 < COLS - 1 {
                    player_pos.1 = player_pos.1 + 1;
                } else {
                    println!("Ouch! You hit the right wall.");
                }
            }
            'w' => {
                if player_pos.0 > 0 {
                    player_pos.0 = player_pos.0 - 1;
                } else {
                    println!("Ouch! You hit the ceiling.");
                }
            }
            _ => {
                continue;
            }
        }

        print_game(&current_phase, &player_pos);

        if player_pos.0 < ROWS && player_pos.1 < COLS {
            if game_field[player_pos.0][player_pos.1].has_mine {
                println!("Uh Oh!\nYou've lost by running into a mine!");
                has_lost = true;
                break;
            }
        }
    }

    if !has_lost {
        println!("\n===================================");
        println!("    Congratulations, you won!");
        println!("===================================");
    }
}

fn print_game(phase: &char, player_pos: &(usize, usize)) {
    let mut game = String::new();

    for row in 0..ROWS {
        for col in 0..COLS {
            if (row, col) == *player_pos {
                game.push(*phase);
                game.push(' ');
            } else {
                game.push_str(". ");
            }
        }
        game.push('\n');
    }

    print!("{}", game)
}

fn mine_positions(mine_count: usize) -> Vec<[usize; 2]> {
    let mut rng = rand::rng();
    let mut positions: Vec<[usize; 2]> = Vec::with_capacity(mine_count);

    while positions.len() < mine_count {
        let x: usize = rng.random_range(0..ROWS);
        let y: usize = rng.random_range(0..COLS);
        let coord = [x, y];

        if !positions.contains(&coord) {
            positions.push(coord);
        }
    }

    positions
}
