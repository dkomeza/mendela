class Snek {
  field: number[][];
  snek: number[][];
  static rotation: number;
  static moveInterval: number;
  static interval: number;
  static fastMode: boolean;

  constructor(size: number) {
    this.field = this.createField(size);
    Snek.rotation = Math.floor(Math.random() * 4);
    this.snek = this.createSnake(this.field);
    this.createKeyboardEvents();
    Snek.interval = 500;
    Snek.moveInterval = this.createMoveInterval(Snek.interval);
    this.drawField(size);
    this.createFood();
    Snek.fastMode = false;
  }

  createField(size: number) {
    let field: number[][] = [];
    for (let i = 0; i < size; i++) {
      field[i] = [];
      for (let j = 0; j < size; j++) [(field[i][j] = 0)];
    }
    return field;
  }

  createSnake(field: number[][]) {
    let x = Math.floor(Math.random() * (field[0].length - 10)) + 5; // make sure snek does not spawn in a wall
    let y = Math.floor(Math.random() * (field.length - 10)) + 5; // make sure snek does not spawn in a wall
    let snek = [[x, y]];
    // field[y][x] = -1;
    return snek;
  }

  createKeyboardEvents() {
    window.onkeydown = function (e) {
      switch (e.code) {
        case "ArrowUp":
          Snek.rotation = 0;
          break;
        case "ArrowDown":
          Snek.rotation = 2;
          break;
        case "ArrowRight":
          Snek.rotation = 1;
          break;
        case "ArrowLeft":
          Snek.rotation = 3;
          break;
        case "Space":
          Snek.fastMode = true;
          break;
        default:
          return;
      }
    };
    window.onkeyup = function (e) {
      switch (e.code) {
        case "Space":
          Snek.fastMode = false;
          break;
        default:
          return;
      }
    };
  }

  createMoveInterval(time: number) {
    let moveInterval = setInterval(() => {
      this.moveSnake(this.field, this.snek, Snek.rotation);
    }, time);
    return moveInterval;
  }

  drawField(size: number) {
    let w = window.innerWidth;
    let cellSize = Math.floor(w / 2 / size);
    let container = document.createElement("main");
    let table = document.createElement("table");
    for (let i = 0; i < size; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < size; j++) {
        let cell = document.createElement("td");
        cell.classList.add("cell");
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        if ((i + j) % 2 === 0) {
          cell.classList.add("dark");
        } else {
          cell.classList.add("light");
        }
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    container.appendChild(table);
    document.body.appendChild(container);
  }

  moveSnake(field: number[][], snek: number[][], rotation: number) {
    let cells = document.querySelectorAll(".cell");
    let newTile: number[] = [];
    switch (rotation) {
      case 0:
        newTile = [snek[0][0] - 1, snek[0][1]];
        break;
      case 1:
        newTile = [snek[0][0], snek[0][1] + 1];
        break;
      case 2:
        newTile = [snek[0][0] + 1, snek[0][1]];
        break;
      case 3:
        newTile = [snek[0][0], snek[0][1] - 1];
        break;
    }
    if (
      newTile[0] < 0 ||
      newTile[0] >= field.length ||
      newTile[1] < 0 ||
      newTile[1] >= field.length ||
      field[newTile[0]][newTile[1]] === -1
    ) {
      clearInterval(Snek.moveInterval);
      alert("Game Over");
    } else if (field[newTile[0]][newTile[1]] === 0) {
      snek.unshift(newTile);
      let index = newTile[0] * this.field.length + newTile[1];
      cells[index].classList.add("snek");
      let lastTile = snek.pop()!;
      field[lastTile[0]][lastTile[1]] = 0;
      index = lastTile[0] * this.field.length + lastTile[1];
      cells[index].classList.remove("snek");
    } else if (field[newTile[0]][newTile[1]] === 1) {
      // snek eats food
      snek.unshift(newTile);
      let index = newTile[0] * this.field.length + newTile[1];
      cells[index].classList.add("snek");
      this.createFood();
      cells[index].classList.remove("food");
      if (Snek.interval > 300) {
        Snek.interval -= 10;
      }
    }
    if (Snek.fastMode) {
      clearInterval(Snek.moveInterval);
      Snek.moveInterval = this.createMoveInterval(100);
    } else {
      clearInterval(Snek.moveInterval);
      Snek.moveInterval = this.createMoveInterval(Snek.interval);
    }
    field[newTile[0]][newTile[1]] = -1;
  }

  createFood() {
    let x = Math.floor(Math.random() * this.field[0].length);
    let y = Math.floor(Math.random() * this.field.length);
    if (this.field[y][x] === 0) {
      this.field[y][x] = 1;
      let index = y * this.field.length + x;
      let cell = document.querySelectorAll(".cell")[index];
      cell.classList.add("food");
    } else {
      this.createFood();
    }
  }
}

let game = new Snek(20);
