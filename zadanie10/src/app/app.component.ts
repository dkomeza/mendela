import { Component } from '@angular/core';
import init, { eval_moves } from '../assets/core/pkg/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  height = 20;
  width = 20;
  points = 5;
  start = 1;

  board: number[][] = [];

  playerTurn = true;

  leftSquares = 0;

  score = {
    player: 0,
    computer: 0,
  };

  async startGame() {
    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.board[i][j] = 0;
      }
    }
    this.leftSquares = this.height * this.width;
    this.playerTurn = true;
    this.score = {
      player: 0,
      computer: 0,
    };
    await init('assets/core/pkg/core_bg.wasm');
    if (this.start == 2) {
      console.log('start');
      this.playerTurn = false;
      this.generateComputerMove();
    }
  }

  selectCell(row: number, col: number) {
    if (this.playerTurn && this.board[row][col] === 0 && this.leftSquares > 0) {
      this.board[row][col] = 1;
      this.playerTurn = false;
      this.leftSquares--;
      const found = this.checkForLine();
      if (found.length > 0) {
        this.score[found[0].value === 1 ? 'player' : 'computer']++;
        for (const { x, y } of found) {
          this.board[y][x] = this.board[y][x] | 4;
        }
        if (this.checkForWin()) return;
      }
      if (this.leftSquares > 0) {
        this.generateComputerMove();
      } else {
        if (!this.checkForWin()) {
          if (this.score.player > this.score.computer) {
            alert('You win!');
          } else if (this.score.player < this.score.computer) {
            alert('You lose!');
          } else {
            alert('Draw!');
          }

        }
      }
    }
  }

  generateComputerMove() {
    const convertedBoard: number[] = this.board.flat();
    const move = eval_moves(convertedBoard, this.board[0].length);
    if (move.score < 0) {
      let x = Math.floor(Math.random() * this.board[0].length);
      let y = Math.floor(Math.random() * this.board.length);
      while (this.board[y][x] !== 0) {
        x = Math.floor(Math.random() * this.board[0].length);
        y = Math.floor(Math.random() * this.board.length);
      }
      this.board[y][x] = 2;
    } else {
      this.board[move.y][move.x] = 2;
    }
    const found = this.checkForLine();
    if (found.length > 0) {
      this.score[found[0].value === 1 ? 'player' : 'computer']++;
      for (const { x, y } of found) {
        this.board[y][x] = this.board[y][x] | 4;
      }
    }
    this.checkForWin();
    this.leftSquares--;
    this.playerTurn = true;
  }

  private checkForWin() {
    if (this.score.player >= this.points) {
      alert('Player won!');
      this.startGame();
      return true;
    } else if (this.score.computer >= this.points) {
      alert('Computer won!');
      this.startGame();
      return true;
    }
    return false;
  }

  checkForLine(board: number[][] = this.board) {
    // check for horizontal lines
    for (let y = 0; y < board.length; y++) {
      const row = board[y].map((x, i) => ({ x: i, y, value: x }));
      const found = this.checkLine(row);

      if (found.length > 0) {
        return found;
      }
    }

    // check for vertical lines
    for (let x = 0; x < board[0].length; x++) {
      const col = board.map((y, i) => ({ x, y: i, value: y[x] }));
      const found = this.checkLine(col);

      if (found.length > 0) {
        return found;
      }
    }

    // check for diagonal lines
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        const line = [];
        let x1 = x;
        let y1 = y;

        while (x1 < board[0].length && y1 < board.length) {
          const block = { x: x1, y: y1, value: board[y1][x1] };
          line.push(block);
          x1++;
          y1++;
        }
        let found = this.checkLine(line);
        if (found.length > 0) {
          return found;
        }

        line.length = 0;

        x1 = x;
        y1 = y;

        while (x1 >= 0 && y1 >= 0) {
          const block = { x: x1, y: y1, value: board[y1][x1] };
          line.push(block);
          x1++;
          y1--;
        }
        found = this.checkLine(line);
        if (found.length > 0) {
          return found;
        }
      }
    }

    return [];
  }

  checkLine(line: { x: number; y: number; value: number }[]) {
    const found: { x: number; y: number; value: number }[] = [];
    let toAdd: { x: number; y: number; value: number }[] = [];

    for (const { x, y, value } of line) {
      if (value === 1 || value === 2) {
        if (toAdd.length === 0) {
          toAdd.push({ x, y, value });
        } else if (toAdd[0].value === value) {
          toAdd.push({ x, y, value });
        } else {
          if (toAdd.length >= 5) {
            found.push(...toAdd);
          }
          toAdd = [{ x, y, value }];
        }
      } else {
        if (toAdd.length >= 5) {
          found.push(...toAdd);
        }
        toAdd = [];
      }
    }
    if (toAdd.length >= 5) {
      found.push(...toAdd);
    }

    return found;
  }
}
