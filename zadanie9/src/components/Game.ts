type Cell = Block | 0;
type Direction = "left" | "right";

// interface Cell {

/**
 * The main game class that handles the game logic.
 * @class Game
 */
class Game {
  board: Board;
  fallingCells = [] as Block[];
  activeBlock: ActiveBlock | undefined;
  boardElement: HTMLDivElement | undefined;
  speed = 800;
  fastSpeed = 1000 - (1000 - this.speed) / 5;

  private gameInterval: number | undefined;
  private fastMode = false;

  constructor() {
    this.board = new Board({ width: 10, height: 20 });
  }

  /**
   * Starts the game.
   * @memberof Game
   * @method start
   * @returns {void}
   * @example
   * Game.start();
   */
  start(): void {
    this.renderBoard();
    this.gameInterval = setInterval(this.loop.bind(this), 1000 - this.speed);
  }

  /**
   * Renders the board.
   * @memberof Game
   * @method renderBoard
   * @returns {void}
   */
  private renderBoard(): void {
    const game = document.createElement("div");
    game.classList.add("game");
    for (let i = 0; i < this.board.board.length; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < this.board.board[i].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        row.appendChild(cell);
      }
      game.appendChild(row);
    }
    document.body.appendChild(game);
    this.boardElement = game;
  }

  /**
   * The main game loop.
   * @memberof Game
   * @method loop
   * @returns {void}
   */
  private loop(): void {
    if (this.fallingCells.length === 0) {
      this.stopFastDrop();
      this.spawnBlock();
    } else {
      this.moveCells();
    }
  }

  /**
   * Spawns a new block.
   * @memberof Game
   * @method spawnBlock
   * @returns {void}
   */
  private spawnBlock(): void {
    this.activeBlock = new ActiveBlock(this.board.board);
    this.activeBlock.applyToBoard(this.boardElement);
    this.fallingCells = [this.activeBlock.blocks[1]];
  }

  /**
   * Moves the falling cells.
   * @memberof Game
   * @method moveCells
   * @returns {void}
   */
  private moveCells(): void {
    for (let i = 0; i < this.fallingCells.length; i++) {
      const cell = this.fallingCells[i];
      cell.fall();
      if (!cell.falling) {
        this.fallingCells.splice(i, 1);
        i--;
      }
    }
  }

  /**
   * Moves the active block (left or right).
   * @memberof Game
   * @method move
   * @param {Direction} direction The direction to move the block.
   * @returns {void}
   * @example
   * Game.move("left");
   * Game.move("right");
   */
  public move(direction: Direction): void {
    if (this.activeBlock && !this.fastMode) {
      this.activeBlock.blocks[1].move(direction);
    }
  }

  /**
   * Rotates the active block.
   * @memberof Game
   * @method rotate
   * @param {Direction} direction The direction to rotate the block.
   * @returns {void}
   * @example
   * Game.rotate("left");
   * Game.rotate("right");
   */
  public rotate(direction: Direction): void {
    if (this.activeBlock && !this.fastMode) {
      this.activeBlock.blocks[1].rotate(direction);
    }
  }

  /**
   * Starts fast drop mode.
   * @memberof Game
   * @method startFastDrop
   * @returns {void}
   */
  public fastDrop(): void {
    this.fastMode = true;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(
        this.loop.bind(this),
        1000 - this.fastSpeed
      );
    }
  }

  /**
   * Stops fast drop mode.
   * @memberof Game
   * @method stopFastDrop
   * @returns {void}
   */
  public stopFastDrop(): void {
    if (this.gameInterval && this.fastMode) {
      this.fastMode = false;
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.loop.bind(this), 1000 - this.speed);
    }
  }
}

class Board {
  board: Array<Array<Cell>> = [];
  constructor(dimmensions: { width: number; height: number }) {
    this.board = Array(dimmensions.height)
      .fill(0)
      .map(() => Array(dimmensions.width).fill(0));
  }
  // ...
}

class ActiveBlock {
  public blocks = {} as {
    1: Block;
    2: Block;
  };

  constructor(board: Cell[][]) {
    const x = Math.floor((board[0].length - 1) / 2);
    const y = 0;
    this.blocks = {
      1: new Block(board, { x, y }),
      2: new Block(board, { x: x + 1, y }),
    };
    this.blocks[1].connectBlock(this.blocks[2]);
  }

  public applyToBoard(boardElement: HTMLDivElement | undefined) {
    if (boardElement) {
      boardElement.append(this.blocks[1].element, this.blocks[2].element);
    }
  }
}

class Block {
  private board: Cell[][];
  public element: HTMLDivElement;
  private connected: Block | null = null;
  private rotation: 0 | 1 | 2 | 3 = 0;

  public position: { x: number; y: number } = { x: -1, y: -1 };
  public color: Colors = Colors.RED;
  public falling = true;

  constructor(board: Cell[][], { x, y }: { x: number; y: number }) {
    const cell = document.createElement("div");
    cell.classList.add("blob");
    this.element = cell;
    this.board = board;
    this.position = { x, y };
    this.board[y][x] = this;
    this.color = this.createRandomColor();
    this.renderBlock();
  }

  private createRandomColor(): Colors {
    const colors = Object.values(Colors).filter(
      (v) => !isNaN(Number(v))
    ) as Colors[];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public connectBlock(block: Block) {
    this.connected = block;
  }

  private renderBlock() {
    this.element.style.left = `${this.position.x * 32}px`;
    this.element.style.top = `${this.position.y * 32}px`;
    switch (this.color) {
      case Colors.RED:
        this.element.style.backgroundColor = "red";
        break;
      case Colors.BLUE:
        this.element.style.backgroundColor = "blue";
        break;
      case Colors.YELLOW:
        this.element.style.backgroundColor = "yellow";
        break;
    }
  }

  public fall() {
    if (this.connected) {
      const bottomCell =
        this.position.y >= this.connected.position.y ? this : this.connected;
      const topCell =
        this.position.y < this.connected.position.y ? this : this.connected;
      const leftCell =
        this.position.x <= this.connected.position.x ? this : this.connected;
      const rightCell =
        this.position.x > this.connected.position.x ? this : this.connected;

      const sameRow = bottomCell.position.y === topCell.position.y;
      const sameColumn = leftCell.position.x === rightCell.position.x;

      if (sameRow) {
        // check if on the bottom
        if (bottomCell.position.y === this.board.length - 1) {
          this.falling = false;
          this.connected.falling = false;
          this.connected = null;
          return;
        }

        // check if there is a block below the left cell
        if (
          this.board[leftCell.position.y + 1][leftCell.position.x] instanceof
          Block
        ) {
          this.falling = false;
          this.connected.falling = false;
          this.connected = null;
          return;
        }

        console.log("co do");
        // check if there is a block below the right cell
        if (
          this.board[rightCell.position.y + 1][rightCell.position.x] instanceof
          Block
        ) {
          this.falling = false;
          this.connected.falling = false;
          this.connected = null;
          return;
        }
      } else if (sameColumn) {
        // check if on the bottom
        if (bottomCell.position.y === this.board.length - 1) {
          this.falling = false;
          this.connected.falling = false;
          this.connected = null;
          return;
        }

        // check if there is a block below the bottom cell
        if (
          this.board[bottomCell.position.y + 1][
            bottomCell.position.x
          ] instanceof Block
        ) {
          this.falling = false;
          this.connected.falling = false;
          this.connected = null;
          return;
        }
      }

      // update board
      this.board[this.position.y][this.position.x] = 0;
      this.board[this.connected.position.y][this.connected.position.x] = 0;
      this.board[this.position.y + 1][this.position.x] = this;
      this.board[this.connected.position.y + 1][this.connected.position.x] =
        this.connected;

      // move down
      this.position.y += 1;
      this.updatePosition(this);
      this.connected.position.y += 1;
      this.updatePosition(this.connected);
    }
  }

  public move(direction: Direction) {
    const moveDirection = direction === "left" ? -1 : 1;
    if (!this.connected) {
      return;
    }
    const bottomCell =
      this.position.y >= this.connected.position.y ? this : this.connected;
    const topCell =
      this.position.y < this.connected.position.y ? this : this.connected;
    const leftCell =
      this.position.x <= this.connected.position.x ? this : this.connected;
    const rightCell =
      this.position.x > this.connected.position.x ? this : this.connected;

    const sameRow = bottomCell.position.y === topCell.position.y;
    const sameColumn = leftCell.position.x === rightCell.position.x;

    if (sameRow) {
      if (direction === "left") {
        if (leftCell.position.x === 0) {
          return;
        }
        if (
          this.board[leftCell.position.y][
            leftCell.position.x + moveDirection
          ] instanceof Block
        ) {
          return;
        }
      } else if (direction === "right") {
        if (rightCell.position.x === this.board[0].length - 1) {
          return;
        }
        if (
          this.board[rightCell.position.y][
            rightCell.position.x + moveDirection
          ] instanceof Block
        ) {
          return;
        }
      }
    } else if (sameColumn) {
      if (direction === "left") {
        if (leftCell.position.x === 0) {
          return;
        }
      } else if (direction === "right") {
        if (rightCell.position.x === this.board[0].length - 1) {
          return;
        }
      }
      const topClear = !(
        this.board[topCell.position.y][
          topCell.position.x + moveDirection
        ] instanceof Block
      );
      const bottomClear = !(
        this.board[bottomCell.position.y][
          bottomCell.position.x + moveDirection
        ] instanceof Block
      );

      if (!topClear || !bottomClear) {
        return;
      }
    }

    // update board
    this.board[this.position.y][this.position.x] = 0;
    this.board[this.connected.position.y][this.connected.position.x] = 0;
    this.board[this.position.y][this.position.x + moveDirection] = this;
    this.board[this.connected.position.y][
      this.connected.position.x + moveDirection
    ] = this.connected;

    // move
    this.position.x += moveDirection;
    this.updatePosition(this);
    this.connected.position.x += moveDirection;
    this.updatePosition(this.connected);
  }

  public rotate(direction: Direction) {
    const rotateDirection = direction === "left" ? -1 : 1;

    if (!this.connected) {
      return;
    }

    const previousPosition = {
      x: this.position.x,
      y: this.position.y,
    };
    const previousConnectedPosition = {
      x: this.connected.position.x,
      y: this.connected.position.y,
    };

    this.rotation += rotateDirection;

    if (this.rotation === 4) {
      this.rotation = 0;
    } else if (this.rotation === -1) {
      this.rotation = 3;
    }

    this.rotation = this.rotation as 0 | 1 | 2 | 3;

    const bottomCell =
      this.position.y >= this.connected.position.y ? this : this.connected;
    const topCell =
      this.position.y < this.connected.position.y ? this : this.connected;
    const leftCell =
      this.position.x <= this.connected.position.x ? this : this.connected;
    const rightCell =
      this.position.x > this.connected.position.x ? this : this.connected;

    const sameRow = bottomCell.position.y === topCell.position.y;
    const sameColumn = leftCell.position.x === rightCell.position.x;

    if (sameRow) {
      if (direction === "left") {
        rightCell.position.x -= 1;
        rightCell.position.y -= 1;
        if (rightCell.position.x < 0 || rightCell.position.y < 0) {
          this.rotation -= rotateDirection;
          this.position = previousPosition;
          this.connected.position = previousConnectedPosition;
          return;
        }
      }
      if (direction === "right") {
        rightCell.position.x -= 1;
        leftCell.position.y -= 1;
        if (rightCell.position.x < 0 || leftCell.position.y < 0) {
          this.rotation -= rotateDirection;
          this.position = previousPosition;
          this.connected.position = previousConnectedPosition;
          return;
        }
      }
    }
    if (sameColumn) {
      if (direction === "left") {
        topCell.position.y += 1;
        bottomCell.position.x += 1;
        if (bottomCell.position.x > this.board[0].length - 1) {
          topCell.position.x -= 1;
          bottomCell.position.x -= 1;
        }
      }
      if (direction === "right") {
        topCell.position.y += 1;
        topCell.position.x += 1;
        if (topCell.position.x > this.board[0].length - 1) {
          topCell.position.x -= 1;
          bottomCell.position.x -= 1;
        }
      }
    }

    this.board[previousPosition.y][previousPosition.x] = 0;
    this.board[previousConnectedPosition.y][previousConnectedPosition.x] = 0;

    if (
      this.board[this.position.y][this.position.x] instanceof Block ||
      this.board[this.connected.position.y][
        this.connected.position.x
      ] instanceof Block
    ) {
      this.rotation -= rotateDirection;
      this.position = previousPosition;
      this.connected.position = previousConnectedPosition;
    }

    this.board[this.position.y][this.position.x] = this;
    this.board[this.connected.position.y][this.connected.position.x] =
      this.connected;
    this.updatePosition(this);
    this.updatePosition(this.connected);
  }

  private updatePosition(block: Block) {
    block.element.style.left = `${block.position.x * 32}px`;
    block.element.style.top = `${block.position.y * 32}px`;
  }
}

enum Colors {
  RED,
  BLUE,
  YELLOW,
}

export default new Game();

// Path: src/components/Game.ts
