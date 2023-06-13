import { Component } from '@angular/core';
import init, { eval_moves } from '../assets/core/pkg/core';

interface Move {
  x: number;
  y: number;
  score: number;
}

interface Cell {
  value: number;
  score: number;
}

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

  board: Cell[][] = [];

  playerTurn = true;

  leftSquares = 0;

  aiTurn = 1;
  aiInterval: any;

  startTime = 0;

  score = {
    player: 0,
    computer: 0,
  };

  times: number[] = [];

  async startGame() {
    clearInterval(this.aiTurn);
    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.board[i][j] = {
          value: 0,
          score: 0,
        };
      }
    }
    this.leftSquares = this.height * this.width;
    this.playerTurn = true;
    this.score = {
      player: 0,
      computer: 0,
    };
    await init('assets/core/pkg/core_bg.wasm');
    this.startTime = performance.now();
    if (this.start == 2) {
      console.log('start');
      this.playerTurn = false;
      this.generateComputerMove();
    }
  }

  selectCell(row: number, col: number) {
    if (
      this.playerTurn &&
      this.board[row][col].value === 0 &&
      this.leftSquares > 0
    ) {
      this.board[row][col] = {
        value: 1,
        score: this.board[row][col].score,
      };
      this.playerTurn = false;
      this.leftSquares--;
      const found = this.checkForLine();
      if (found.length > 0) {
        this.score[found[0].value === 1 ? 'player' : 'computer']++;
        for (const { x, y } of found) {
          this.board[y][x] = {
            value: this.board[y][x].value | 4,
            score: this.board[y][x].score,
          };
        }
        if (this.checkForWin()) return;
      }
      if (this.leftSquares > 0) {
        this.generateComputerMove();
      } else {
        if (!this.checkForWin()) {
          if (this.score.player > this.score.computer) {
            const avg =
              this.times.reduce((a, b) => a + b, 0) / this.times.length;
            alert(`Player won!, time: ${Math.floor(avg)}ms`);
          } else if (this.score.player < this.score.computer) {
            const avg =
              this.times.reduce((a, b) => a + b, 0) / this.times.length;
            alert(`Computer won!, time: ${Math.floor(avg)}ms`);
          } else {
            const avg =
              this.times.reduce((a, b) => a + b, 0) / this.times.length;
            alert(`Draw!, time: ${Math.floor(avg)}ms`);
          }
        }
      }
    }
  }

  generateComputerMove() {
    const convertedBoard: number[] = this.board.flat().map((x) => x.value);
    const moves = eval_moves(convertedBoard, this.board[0].length, 2) as Move[];
    const move = moves[0];
    if (move.score < 0) {
      let x = Math.floor(Math.random() * this.board[0].length);
      let y = Math.floor(Math.random() * this.board.length);
      while (this.board[y][x].value !== 0) {
        x = Math.floor(Math.random() * this.board[0].length);
        y = Math.floor(Math.random() * this.board.length);
      }
      this.board[y][x] = {
        value: 2,
        score: this.board[y][x].score,
      };
    } else {
      this.board[move.y][move.x] = {
        value: 2,
        score: this.board[move.y][move.x].score,
      };
    }
    const found = this.checkForLine();
    if (found.length > 0) {
      this.score[found[0].value === 1 ? 'player' : 'computer']++;
      for (const { x, y } of found) {
        this.board[y][x] = {
          value: this.board[y][x].value | 4,
          score: this.board[y][x].score,
        };
      }
    }
    this.checkForWin();
    this.showScore(moves);
    this.leftSquares--;
    this.playerTurn = true;

    if (this.leftSquares === 0 && !this.checkForWin()) {
      if (this.score.player > this.score.computer) {
        const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length;
        alert(`Player won!, time: ${Math.floor(avg)}ms`);
      } else if (this.score.player < this.score.computer) {
        const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length;
        alert(`Computer won!, time: ${Math.floor(avg)}ms`);
      } else {
        const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length;
        alert(`Draw!, time: ${Math.floor(avg)}ms`);
      }
    }
  }

  private checkForWin() {
    if (this.score.player >= this.points) {
      const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length;
      alert(`Player won!, time: ${Math.floor(avg)}ms`);
      return true;
    } else if (this.score.computer >= this.points) {
      const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length;
      alert(`Computer won!, time: ${Math.floor(avg)}ms`);
      return true;
    }
    return false;
  }

  checkForLine(board: Cell[][] = this.board) {
    // check for horizontal lines
    for (let y = 0; y < board.length; y++) {
      const row = board[y].map((x, i) => ({ x: i, y, value: x.value }));
      const found = this.checkLine(row);

      if (found.length > 0) {
        return found;
      }
    }

    // check for vertical lines
    for (let x = 0; x < board[0].length; x++) {
      const col = board.map((y, i) => ({ x, y: i, value: y[x].value }));
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
          const block = { x: x1, y: y1, value: board[y1][x1].value };
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

        while (
          x1 >= 0 &&
          y1 >= 0 &&
          x1 < board[0].length &&
          y1 < board.length
        ) {
          const block = { x: x1, y: y1, value: board[y1][x1].value };
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

  showScore(moves: Move[]) {
    this.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.score = 0;
      });
    });
    const max = moves[0].score;
    const min = moves[moves.length - 1].score;

    const score = (x: number) => {
      return x === 0 ? 0 : (x - min) / (max - min);
    };

    for (const move of moves) {
      const x = move.x;
      const y = move.y;
      this.board[y][x] = {
        value: this.board[y][x].value,
        score: score(move.score),
      };
    }
  }
}
