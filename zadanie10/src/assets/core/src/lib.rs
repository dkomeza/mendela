use std::collections::HashMap;

extern crate wasm_bindgen;

use serde::Serialize;
use wasm_bindgen::prelude::*;

extern crate console_error_panic_hook;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn eval_moves(_board: Vec<JsValue>, width: usize, color: i8) -> Vec<JsValue> {
    console_error_panic_hook::set_once();
    let mut board: Vec<Vec<i8>> = Vec::new();

    for i in 0..width {
        let mut row: Vec<i8> = Vec::new();
        for j in 0..width {
            let index = (i * width + j) as usize;
            let value = _board[index].as_f64().unwrap() as i8;
            row.push(value);
        }
        board.push(row);
    }
    let mut iteration = 1;
    let mut move_map: HashMap<i16, Move> = HashMap::new();
    while iteration < 5 {
        let lines = check_for_line(&board, iteration);
        if lines.len() > 0 {
            for line in lines {
                let moves = get_moves(line, &board, color);
                for m in moves {
                    let index = (m.y * width + m.x) as i16;
                    let saved_move = move_map.get(&index);
                    if saved_move.is_none() {
                        move_map.insert(index, m);
                    } else {
                        let b = saved_move.unwrap();
                        if b.score < m.score {
                            move_map.insert(index, m);
                        }
                    }
                }
            }
        }
        iteration += 1;
    }

    let mut all_moves: Vec<&Move> = move_map.values().collect::<Vec<&Move>>();

    all_moves.sort_by_key(|m| m.score);
    all_moves.reverse();

    let mut result: Vec<JsValue> = Vec::new();
    for m in all_moves {
        result.push(JsValue::from_serde(&m).unwrap());
    }
    return result;
}

fn check_for_line(_board: &Vec<Vec<i8>>, threshold: usize) -> Vec<Vec<Block>> {
    let mut lines: Vec<Vec<Block>> = Vec::new();

    let height = _board.len();
    let width = _board[0].len();

    // check for horizontal lines
    for y in 0..height {
        let mut line = Vec::new();
        for x in 0..width {
            let block = Block {
                x,
                y,
                value: _board[y][x],
            };
            line.push(block);
        }
        let mut found = check_line(line, threshold);
        if found.len() > 0 {
            lines.append(&mut found);
        }
    }

    // check for vertical lines
    for x in 0..width {
        let mut line = Vec::new();
        for y in 0..height {
            let block = Block {
                x,
                y,
                value: _board[y][x],
            };
            line.push(block);
        }
        let mut found = check_line(line, threshold);
        if found.len() > 0 {
            lines.append(&mut found);
        }
    }

    // check for diagonal lines
    for y in 0..height {
        for x in 0..width {
            let mut line = Vec::new();
            let mut x1 = x;
            let mut y1 = y;
            while x1 < width && y1 < height {
                let block = Block {
                    x: x1,
                    y: y1,
                    value: _board[y1][x1],
                };
                line.push(block);
                x1 += 1;
                y1 += 1;
            }
            let mut found = check_line(line, threshold);
            if found.len() > 0 {
                lines.append(&mut found);
            }

            let mut line = Vec::new();
            let mut x1 = x;
            let mut y1 = y;
            while x1 < width && y1 < height {
                let block = Block {
                    x: x1,
                    y: y1,
                    value: _board[y1][x1],
                };
                line.push(block);
                x1 += 1;
                y1 -= 1;
            }
            let mut found = check_line(line, threshold);
            if found.len() > 0 {
                lines.append(&mut found);
            }
        }
    }

    return lines;
}

fn check_line(line: Vec<Block>, threshold: usize) -> Vec<Vec<Block>> {
    let mut found: Vec<Vec<Block>> = Vec::new();
    let mut to_add: Vec<Block> = Vec::new();

    for block in line {
        if block.value == 1 || block.value == 2 {
            if to_add.len() == 0 {
                to_add.push(block);
            } else if to_add[0].value == block.value {
                to_add.push(block);
            } else {
                if to_add.len() >= threshold {
                    found.push(to_add.clone());
                }
                to_add.clear();
                to_add.push(block);
            }
        } else {
            if to_add.len() >= threshold {
                found.push(to_add.clone());
            }
            to_add.clear();
        }
    }
    if to_add.len() >= threshold {
        found.push(to_add);
    }

    return found;
}

fn get_moves(line: Vec<Block>, _board: &Vec<Vec<i8>>, color: i8) -> Vec<Move> {
    let own = line[0].value == color;

    if line.len() == 1 {
        let mut moves = Vec::new();
        for y in -1..2 {
            for x in -1..2 {
                if y == 0 && x == 0 {
                    continue;
                }
                let move_x = line[0].x as i8 + x;
                let move_y = line[0].y as i8 + y;
                if move_x < 0 || move_x >= _board[0].len() as i8 {
                    continue;
                }
                if move_y < 0 || move_y >= _board.len() as i8 {
                    continue;
                }

                if _board[move_y as usize][move_x as usize] == 0 {
                    let m = Move {
                        x: move_x as usize,
                        y: move_y as usize,
                        score: own as i16,
                    };
                    moves.push(m);
                }
            }
        }
        return moves;
    }

    if own {
        let moves = get_moves_own(&line, _board);
        return moves;
    } else {
        let moves = block_oponent(&line, _board);
        return moves;
    }
}

fn block_oponent(line: &Vec<Block>, board: &Vec<Vec<i8>>) -> Vec<Move> {
    let mut moves = Vec::new();

    let length = line.len();

    let block_start = line[0];
    let block_end = line[length - 1];

    let diff_x = block_end.x as i8 - block_start.x as i8;
    let diff_y = block_end.y as i8 - block_start.y as i8;

    let mut vector = Vector::new(diff_x, diff_y);
    vector.normalize();

    let mut empty_start = false;
    let mut empty_end = false;

    if block_start.x as i8 - vector.x >= 0
        && block_start.x as i8 - vector.x < board[0].len() as i8
        && block_start.y as i8 - vector.y >= 0
        && block_start.y as i8 - vector.y < board.len() as i8
    {
        if board[(block_start.y as i8 - vector.y) as usize]
            [(block_start.x as i8 - vector.x) as usize]
            == 0
        {
            empty_start = true;
        }
    }

    if block_end.x as i8 + vector.x >= 0
        && block_end.x as i8 + vector.x < board[0].len() as i8
        && block_end.y as i8 + vector.y >= 0
        && block_end.y as i8 + vector.y < board.len() as i8
    {
        if board[(block_end.y as i8 + vector.y) as usize][(block_end.x as i8 + vector.x) as usize]
            == 0
        {
            empty_end = true;
        }
    }

    // ignore closed lines
    if (!empty_start) && (!empty_end) {
        return moves;
    }

    let finnish = can_finnish(line, board);

    if !finnish {
        return moves;
    }

    // check for 4 in a row
    if length == 4 {
        if empty_start && empty_end {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 16,
            };
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 16,
            };
            moves.push(move_start);
            moves.push(move_end);
        } else if empty_start {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 255,
            };
            moves.push(move_start);
        } else if empty_end {
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 255,
            };
            moves.push(move_end);
        }
    }

    // check for 3 in a row
    if length == 3 {
        if empty_start && empty_end {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 127,
            };
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 127,
            };
            moves.push(move_start);
            moves.push(move_end);
        } else if empty_start {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 8,
            };
            moves.push(move_start);
        } else if empty_end {
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 8,
            };
            moves.push(move_end);
        }
    }

    // check for 2 in a row
    if length == 2 {
        if empty_start && empty_end {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 2,
            };
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 2,
            };
            moves.push(move_start);
            moves.push(move_end);
        } else if empty_start {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 1,
            };
            moves.push(move_start);
        } else if empty_end {
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 1,
            };
            moves.push(move_end);
        }
    }

    // check for split lines
    // check before the start
    let mut check_x = block_start.x as i8 - (2 * vector.x);
    let mut check_y = block_start.y as i8 - (2 * vector.y);

    let color = block_start.value;

    let mut split_start_length = 0;

    while check_x >= 0
        && check_x < board[0].len() as i8
        && check_y >= 0
        && check_y < board.len() as i8
        && board[check_y as usize][check_x as usize] == color
    {
        split_start_length += 1;
        check_x -= vector.x;
        check_y -= vector.y;
    }

    // check after the end
    check_x = block_end.x as i8 + (2 * vector.x);
    check_y = block_end.y as i8 + (2 * vector.y);

    let mut split_end_length = 0;

    while check_x >= 0
        && check_x < board[0].len() as i8
        && check_y >= 0
        && check_y < board.len() as i8
        && board[check_y as usize][check_x as usize] == color
    {
        split_end_length += 1;
        check_x += vector.x;
        check_y += vector.y;
    }

    if length == 3 {
        if empty_start && empty_end {
        } else if empty_start {
            if split_start_length > 0 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 16,
                };
                moves.push(move_start);
            }
        } else if empty_end {
            if split_end_length > 0 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 16,
                };
                moves.push(move_end);
            }
        }
    }

    if length == 2 {
        if empty_start && empty_end {
            if split_start_length > 1 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 64,
                };
                moves.push(move_start);
            } else if split_end_length > 1 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 64,
                };
                moves.push(move_end);
            } else if split_start_length > 0 && split_end_length > 0 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 8,
                };
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 8,
                };
                moves.push(move_start);
                moves.push(move_end);
            }
        } else if empty_start {
            if split_start_length > 1 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 64,
                };
                moves.push(move_start);
            } else if split_start_length > 0 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 8,
                };
                moves.push(move_start);
            }
        } else {
            if split_end_length > 1 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 64,
                };
                moves.push(move_end);
            } else if split_end_length > 0 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 8,
                };
                moves.push(move_end);
            }
        }
    }

    return moves;
}

fn get_moves_own(line: &Vec<Block>, board: &Vec<Vec<i8>>) -> Vec<Move> {
    let mut moves = Vec::new();

    let length = line.len();

    let block_start = line[0];
    let block_end = line[length - 1];

    let diff_x = block_end.x as i8 - block_start.x as i8;
    let diff_y = block_end.y as i8 - block_start.y as i8;

    let mut vector = Vector::new(diff_x, diff_y);
    vector.normalize();

    let mut empty_start = false;
    let mut empty_end = false;

    if block_start.x as i8 - vector.x >= 0
        && block_start.x as i8 - vector.x < board[0].len() as i8
        && block_start.y as i8 - vector.y >= 0
        && block_start.y as i8 - vector.y < board.len() as i8
    {
        if board[(block_start.y as i8 - vector.y) as usize]
            [(block_start.x as i8 - vector.x) as usize]
            == 0
        {
            empty_start = true;
        }
    }

    if block_end.x as i8 + vector.x >= 0
        && block_end.x as i8 + vector.x < board[0].len() as i8
        && block_end.y as i8 + vector.y >= 0
        && block_end.y as i8 + vector.y < board.len() as i8
    {
        if board[(block_end.y as i8 + vector.y) as usize][(block_end.x as i8 + vector.x) as usize]
            == 0
        {
            empty_end = true;
        }
    }

    // ignore closed lines
    if (!empty_start) && (!empty_end) {
        return moves;
    }

    let finnish = can_finnish(line, board);

    if !finnish {
        return moves;
    }

    // check for 4 in a row
    if length == 4 {
        if empty_start && empty_end {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 255,
            };
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 255,
            };
            moves.push(move_start);
            moves.push(move_end);
        } else if empty_start {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 255,
            };
            moves.push(move_start);
        } else if empty_end {
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 255,
            };
            moves.push(move_end);
        }
    }

    // check for 3 in a row
    if length == 3 {
        if empty_start && empty_end {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 32,
            };
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 32,
            };
            moves.push(move_start);
            moves.push(move_end);
        } else if empty_start {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 8,
            };
            moves.push(move_start);
        } else if empty_end {
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 8,
            };
            moves.push(move_end);
        }
    }

    // check for 2 in a row
    if length == 2 {
        if empty_start && empty_end {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 4,
            };
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 4,
            };
            moves.push(move_start);
            moves.push(move_end);
        } else if empty_start {
            let move_start = Move {
                x: (block_start.x as i8 - vector.x) as usize,
                y: (block_start.y as i8 - vector.y) as usize,
                score: 2,
            };
            moves.push(move_start);
        } else if empty_end {
            let move_end = Move {
                x: (block_end.x as i8 + vector.x) as usize,
                y: (block_end.y as i8 + vector.y) as usize,
                score: 2,
            };
            moves.push(move_end);
        }
    }

    // check for split lines
    // check before the start
    let mut check_x = block_start.x as i8 - (2 * vector.x);
    let mut check_y = block_start.y as i8 - (2 * vector.y);

    let color = block_start.value;

    let mut split_start_length = 0;

    while check_x >= 0
        && check_x < board[0].len() as i8
        && check_y >= 0
        && check_y < board.len() as i8
        && board[check_y as usize][check_x as usize] == color
    {
        split_start_length += 1;
        check_x -= vector.x;
        check_y -= vector.y;
    }

    // check after the end
    check_x = block_end.x as i8 + (2 * vector.x);
    check_y = block_end.y as i8 + (2 * vector.y);

    let mut split_end_length = 0;

    while check_x >= 0
        && check_x < board[0].len() as i8
        && check_y >= 0
        && check_y < board.len() as i8
        && board[check_y as usize][check_x as usize] == color
    {
        split_end_length += 1;
        check_x += vector.x;
        check_y += vector.y;
    }

    if length == 3 {
        if empty_start && empty_end {
        } else if empty_start {
            if split_start_length > 0 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 16,
                };
                moves.push(move_start);
            }
        } else if empty_end {
            if split_end_length > 0 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 16,
                };
                moves.push(move_end);
            }
        }
    }

    if length == 2 {
        if empty_start && empty_end {
            if split_start_length > 0 && split_end_length > 0 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 8,
                };
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 8,
                };
                moves.push(move_start);
                moves.push(move_end);
            }
        } else if empty_start {
            if split_start_length > 1 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 64,
                };
                moves.push(move_start);
            } else if split_start_length > 0 {
                let move_start = Move {
                    x: (block_start.x as i8 - vector.x) as usize,
                    y: (block_start.y as i8 - vector.y) as usize,
                    score: 4,
                };
                moves.push(move_start);
            }
        } else {
            if split_end_length > 1 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 64,
                };
                moves.push(move_end);
            } else if split_end_length > 0 {
                let move_end = Move {
                    x: (block_end.x as i8 + vector.x) as usize,
                    y: (block_end.y as i8 + vector.y) as usize,
                    score: 4,
                };
                moves.push(move_end);
            }
        }
    }

    return moves;
}

fn can_finnish(line: &Vec<Block>, board: &Vec<Vec<i8>>) -> bool {
    let length = line.len();

    let block_start = line[0];
    let block_end = line[length - 1];

    let diff_x = block_end.x as i8 - block_start.x as i8;
    let diff_y = block_end.y as i8 - block_start.y as i8;

    let mut vector = Vector::new(diff_x, diff_y);
    vector.normalize();

    // check from the start
    let mut free = 0;

    let mut x = block_start.x as i8 - vector.x;
    let mut y = block_start.y as i8 - vector.y;

    while x >= 0 && x < board[0].len() as i8 && y >= 0 && y < board.len() as i8 {
        if board[y as usize][x as usize] == 0 || board[y as usize][x as usize] == block_start.value
        {
            free += 1;
        } else {
            break;
        }

        x -= vector.x;
        y -= vector.y;
    }

    // check from the end
    x = block_end.x as i8 + vector.x;
    y = block_end.y as i8 + vector.y;

    while x >= 0 && x < board[0].len() as i8 && y >= 0 && y < board.len() as i8 {
        if board[y as usize][x as usize] == 0 || board[y as usize][x as usize] == block_start.value
        {
            free += 1;
        } else {
            break;
        }

        x += vector.x;
        y += vector.y;
    }

    if free + length as i8 >= 5 {
        return true;
    }
    return false;
}

#[derive(Clone, Copy, Debug)]
struct Block {
    x: usize,
    y: usize,
    value: i8,
}

#[derive(Clone, Copy, Debug, Serialize)]
pub struct Move {
    pub x: usize,
    pub y: usize,
    pub score: i16,
}

struct Vector {
    x: i8,
    y: i8,
}

impl Vector {
    fn new(x: i8, y: i8) -> Vector {
        Vector { x, y }
    }

    fn normalize(&mut self) {
        self.x = if self.x == 0 {
            0
        } else {
            self.x / self.x.abs()
        };
        self.y = if self.y == 0 {
            0
        } else {
            self.y / self.y.abs()
        };
    }
}
