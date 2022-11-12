class Snek {
  field: number[][];
  snek: number[][];
  activePortal: boolean = false;
  teleport: boolean = false;
  portals: number[][] = [];
  startPortal: number[] = [];
  endPortal: number[] = [];
  deletePortal: boolean = false;
  probability: number = 0;
  static rotation: number;
  static moveInterval: number;
  static portalInterval: number;
  static interval: number;
  static fastMode: boolean;

  constructor(size: number, enablePears: boolean, enablePortals: boolean) {
    this.destroyGame();
    this.field = this.createField(size);
    Snek.rotation = Math.floor(Math.random() * 4);
    this.snek = this.createSnake(this.field);
    this.createKeyboardEvents();
    Snek.interval = 500;
    this.drawField(size);
    if (enablePears) this.probability = 0.1;
    this.createFood();
    if (enablePortals) this.createPortalInterval();
    Snek.fastMode = false;
  }

  startGame() {
    Snek.moveInterval = this.createMoveInterval(Snek.interval);
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
          if (Snek.rotation !== 2) {
            Snek.rotation = 0;
          }
          break;
        case "ArrowDown":
          if (Snek.rotation !== 0) {
            Snek.rotation = 2;
          }
          break;
        case "ArrowRight":
          if (Snek.rotation !== 3) {
            Snek.rotation = 1;
          }
          break;
        case "ArrowLeft":
          if (Snek.rotation !== 1) {
            Snek.rotation = 3;
          }
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

  createPortalInterval() {
    Snek.portalInterval = setInterval(() => {
      if (Math.random() < 0.25 && !this.activePortal) {
        let x1 = Math.floor(Math.random() * (this.field[0].length - 4)) + 2;
        let y1 = Math.floor(Math.random() * (this.field.length - 4)) + 2;
        let x2 = Math.floor(Math.random() * (this.field[0].length - 4)) + 2;
        let y2 = Math.floor(Math.random() * (this.field.length - 4)) + 2;
        let premise = true;
        for (let i = x1 - 2; i < x1 + 2; i++) {
          for (let j = y1 - 2; j < y1 + 2; j++) {
            if (i === x2 && j === y2) premise = false;
          }
        }
        if (this.field[y1][x1] === 0 && this.field[y2][x2] === 0 && premise) {
          this.activePortal = true;
          let index = y1 * this.field.length + x1;
          let cell = document.querySelectorAll(".cell")[index];
          this.field[y1][x1] = 3;
          this.field[y2][x2] = 4;
          cell.classList.add("portal");
          index = y2 * this.field.length + x2;
          cell = document.querySelectorAll(".cell")[index];
          cell.classList.add("portal");
          this.portals = [
            [y1, x1],
            [y2, x2],
          ];
          this.deletePortal = false;
        }
      }
    }, 10000);
  }

  drawField(size: number) {
    let w = window.innerWidth;
    let cellSize = Math.floor(w / 3 / size);
    let container = document.createElement("main");
    container.classList.add("container");
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
    if (this.teleport) {
      newTile = this.endPortal;
      this.startPortal = [];
      this.teleport = false;
    } else {
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
      return;
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
    } else if (field[newTile[0]][newTile[1]] === 2) {
      snek.unshift(newTile);
      let index = newTile[0] * this.field.length + newTile[1];
      cells[index].classList.add("snek");
      this.createFood();
      cells[index].classList.remove("pear");
      if (Snek.interval > 300) {
        Snek.interval -= 10;
      }
      snek.reverse();
      Snek.rotation = this.getRotation(snek[0], snek[1]);
    } else if (field[newTile[0]][newTile[1]] === 3) {
      snek.unshift(newTile);
      let index = newTile[0] * this.field.length + newTile[1];
      cells[index].classList.add("snek");
      let lastTile = snek.pop()!;
      field[lastTile[0]][lastTile[1]] = 0;
      index = lastTile[0] * this.field.length + lastTile[1];
      cells[index].classList.remove("snek");
      this.teleport = true;
      this.startPortal = [this.portals[0][0], this.portals[0][1]];
      this.endPortal = [this.portals[1][0], this.portals[1][1]];
      field[this.portals[1][0]][this.portals[1][1]] = 0;
      field[this.portals[0][0]][this.portals[0][1]] = 0;
    } else if (field[newTile[0]][newTile[1]] === 4) {
      snek.unshift(newTile);
      let index = newTile[0] * this.field.length + newTile[1];
      cells[index].classList.add("snek");
      let lastTile = snek.pop()!;
      field[lastTile[0]][lastTile[1]] = 0;
      index = lastTile[0] * this.field.length + lastTile[1];
      cells[index].classList.remove("snek");
      this.teleport = true;
      this.startPortal = [this.portals[1][0], this.portals[1][1]];
      this.endPortal = [this.portals[0][0], this.portals[0][1]];
      field[this.portals[1][0]][this.portals[1][1]] = 0;
      field[this.portals[0][0]][this.portals[0][1]] = 0;
    }

    if (
      this.portals.length > 0 &&
      this.snek.some(
        (tile) =>
          (tile[0] === this.portals[0][0] && tile[1] === this.portals[0][1]) ||
          (tile[0] === this.portals[1][0] && tile[1] === this.portals[1][1])
      )
    ) {
      console.log("in a portal");
      this.deletePortal = true;
    } else if (this.portals.length > 0 && this.deletePortal) {
      document.querySelectorAll(".portal").forEach((cell) => {
        cell.classList.remove("portal");
      });
      this.activePortal = false;
    }

    if (Snek.fastMode) {
      clearInterval(Snek.moveInterval);
      Snek.moveInterval = this.createMoveInterval(100);
    } else {
      clearInterval(Snek.moveInterval);
      Snek.moveInterval = this.createMoveInterval(Snek.interval);
    }
    field[newTile[0]][newTile[1]] = -1;
    this.colorSnake(snek);
  }

  colorSnake(snek: number[][]) {
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("head");
      cell.classList.remove("tail");
      cell.classList.remove("bend");
      cell.classList.remove("up");
      cell.classList.remove("down");
      cell.classList.remove("left");
      cell.classList.remove("right");
    });
    if (snek.length > 2) {
      for (let i = 0; i < snek.length; i++) {
        if (i === 0) {
          let index = snek[i][0] * this.field.length + snek[i][1];
          cells[index].classList.add("head");

          cells[index].classList.add(this.getRotationName(Snek.rotation));
        } else if (i === snek.length - 1) {
          let index = snek[i][0] * this.field.length + snek[i][1];
          cells[index].classList.add("tail");
          cells[index].classList.add(
            this.getRotationName(this.getRotation(snek[i - 1], snek[i]))
          );
        } else {
          if (
            cells[
              snek[i][0] * this.field.length + snek[i][1]
            ].classList.contains("portal")
          ) {
            cells[snek[i][0] * this.field.length + snek[i][1]].classList.add(
              this.getRotationName(this.getRotation(snek[i], snek[i + 1]))
            );
          } else {
            this.getBend(snek[i + 1], snek[i], snek[i - 1]);
          }
        }
      }
    } else if (snek.length === 2) {
      let index = snek[0][0] * this.field.length + snek[0][1];
      cells[index].classList.add("head");
      cells[index].classList.add(this.getRotationName(Snek.rotation));
      index = snek[1][0] * this.field.length + snek[1][1];
      cells[index].classList.add("tail");
      cells[index].classList.add(
        this.getRotationName(this.getRotation(snek[0], snek[1]))
      );
    } else {
      let index = snek[0][0] * this.field.length + snek[0][1];
      cells[index].classList.add("head");
      cells[index].classList.add(this.getRotationName(Snek.rotation));
    }
  }

  createFood() {
    let x = Math.floor(Math.random() * this.field[0].length);
    let y = Math.floor(Math.random() * this.field.length);
    if (this.field[y][x] === 0) {
      let index = y * this.field.length + x;
      let cell = document.querySelectorAll(".cell")[index];
      if (Math.random() < this.probability) {
        this.field[y][x] = 2;
        cell.classList.add("pear");
      } else {
        this.field[y][x] = 1;
        cell.classList.add("food");
      }
    } else {
      this.createFood();
    }
  }

  getRotationName(rotation: number) {
    switch (rotation) {
      case 0:
        return "up";
      case 1:
        return "right";
      case 2:
        return "down";
      case 3:
        return "left";
      default:
        return "";
    }
  }

  getBend(previous: number[], current: number[], next: number[]) {
    let cells = document.querySelectorAll(".cell");
    let index = current[0] * this.field.length + current[1];
    let vector = [next[0] - previous[0], next[1] - previous[1]];
    if (vector[0] * vector[1] !== 0) {
      let rotation = 0;
      if (current[0] === previous[0]) {
        if (vector[0] === 1) {
          rotation += 2;
          if (vector[1] === 1) {
            rotation += 1;
          }
        } else {
          if (vector[1] === -1) {
            rotation += 1;
          }
        }
      } else {
        if (vector[0] === -1) {
          rotation += 2;
          if (vector[1] === -1) {
            rotation += 1;
          }
        } else {
          if (vector[1] === 1) {
            rotation += 1;
          }
        }
      }
      cells[index].classList.add("bend");
      cells[index].classList.add(this.getRotationName(rotation));
    } else {
      cells[index].classList.add(
        this.getRotationName(this.getRotation(current, previous))
      );
    }
  }

  getRotation(first: number[], second: number[]) {
    if (first[0] === second[0]) {
      if (first[1] > second[1]) {
        return 1;
      } else {
        return 3;
      }
    } else {
      if (first[0] > second[0]) {
        return 2;
      } else {
        return 0;
      }
    }
  }

  destroyGame() {
    clearInterval(Snek.moveInterval);
    clearInterval(Snek.portalInterval);
    if (document.getElementsByClassName("container")[0]) {
      document.getElementsByClassName("container")[0].remove();
    }
  }
}

function createForm() {
  let form = document.createElement("div");
  form.classList.add("form");
  let inputWrapper = document.createElement("p");
  let input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("min", "8");
  input.setAttribute("max", "20");
  input.setAttribute("value", "10");
  let inputLabel = document.createElement("label");
  inputLabel.innerText = "Cell count (one side)";
  inputWrapper.append(input, inputLabel);

  let pearWrapper = document.createElement("p");
  let pearInput = document.createElement("input");
  pearInput.setAttribute("type", "checkbox");
  let pearInputLabel = document.createElement("label");
  pearInputLabel.innerText = "Enable pears? ";
  pearWrapper.append(pearInput, pearInputLabel);

  let portalWrapper = document.createElement("p");
  let portalInput = document.createElement("input");
  portalInput.setAttribute("type", "checkbox");
  let portalInputLabel = document.createElement("label");
  portalInputLabel.innerText = "Enable portals? ";
  portalWrapper.append(portalInput, portalInputLabel);

  let button = document.createElement("button");
  button.innerText = "Start";

  button.onclick = function () {
    let cells = parseInt(input.value);
    let pear = pearInput.checked;
    let portal = portalInput.checked;
    if (cells >= 8 && cells <= 20) {
      let game = new Snek(cells, pear, portal);
      game.startGame();
    }
  };

  form.append(inputWrapper, pearWrapper, portalWrapper, button);
  document.body.append(form);
}

createForm();
