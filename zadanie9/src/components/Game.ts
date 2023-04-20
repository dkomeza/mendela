import UI from "./UI";
import Storage from "./Storage";

type tCell = Cell | Virus | 0;
type Direction = "left" | "right";

type tBoard = tCell[][];

interface iPosition {
  x: number;
  y: number;
}

// interface Cell {

/**
 * The main game class that handles the game logic.
 * @class Game
 */
class Game {
  board: Board;
  fallingCells = [] as Cell[];
  activeBlock: ActiveBlock | undefined;
  nextBlock: ActiveBlock | undefined;
  boardElement: HTMLDivElement | undefined;
  speed = 800;
  fastSpeed = 1000 - (1000 - this.speed) / 5;
  UI: UI | undefined;

  private gameInterval: number | undefined;
  private fastMode = false;

  public viruses: Virus[] = [];

  private score = 0;
  private first = true;

  constructor() {
    this.board = new Board({ width: 8, height: 15 });
    this.board.deleteVirus = this.deleteVirus;
  }

  setUI(UI: UI): void {
    this.UI = UI;
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
    this.generateViruses();
    this.UI?.createViruses(this.viruses);
    this.UI?.createScore();
    this.gameInterval = setInterval(this.loop.bind(this), 1000 - this.speed);
    this.spawnBlock();
  }

  removeInterval(): void {
    clearInterval(this.gameInterval!);
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
    const screen = document.getElementById("screen")!;
    screen.appendChild(game);
    this.boardElement = game;
  }

  private generateViruses(): void {
    const viruses = [];
    for (let i = 0; i < 3; i++) {
      const virus = new Virus(this.board.board);
      viruses.push(virus);
    }
    this.viruses = viruses;
    this.board.addViruses(viruses, this.boardElement!);
  }

  /**
   * The main game loop.
   * @memberof Game
   * @method loop
   * @returns {void}
   */
  private loop(): void {
    if (this.nextBlock && this.nextBlock.animating) {
      return;
    } else {
      if (this.fallingCells.length === 0) {
        const blocksToFall = this.board.checkSameColor();
        if (blocksToFall.length > 0) {
          this.stopFastDrop();
          this.fallingCells = blocksToFall.sort(
            (a, b) => b.position.y - a.position.y
          );
          const allCells = this.allCells();
          allCells.forEach((cell) => cell.updateGraphics());
        } else {
          this.stopFastDrop();
          this.animatePill();
        }
      } else {
        this.moveCells();
      }
    }
    if (this.first) {
      this.first = false;
    }
  }

  private allCells(): Cell[] {
    const cells = [] as Cell[];
    for (let i = 0; i < this.board.board.length; i++) {
      for (let j = 0; j < this.board.board[i].length; j++) {
        const cell = this.board.board[i][j];
        if (cell instanceof Cell) {
          cells.push(cell);
        }
      }
    }
    return cells;
  }

  /**
   * Spawns a new block, returns false if block cannot spawn.
   * @memberof Game
   * @method spawnBlock
   * @returns {boolean}
   */
  private spawnBlock(): boolean {
    this.nextBlock = new ActiveBlock(this.board.board);
    this.nextBlock.animating = false;
    this.UI?.showBlock(this.nextBlock);
    return true;
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
      if (this.viruses.length > 0) {
        this.gameInterval = setInterval(
          this.loop.bind(this),
          1000 - this.fastSpeed
        );
      }
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
      if (this.viruses.length > 0) {
        this.gameInterval = setInterval(
          this.loop.bind(this),
          1000 - this.speed
        );
      }
    }
  }

  public deleteVirus = (block: Virus) => {
    this.viruses = this.viruses.filter((virus) => virus.ID !== block.ID);
    this.UI?.updateViruses(block.ID);
    this.score += 100;
    Storage.saveHighScore(this.score);
    this.UI?.updateScore(this.score);

    if (this.viruses.length === 0) {
      clearInterval(this.gameInterval);
      this.UI?.stageCleared();
    }
  };

  private animatePill() {
    // UI.animateHand();
    if (this.nextBlock) {
      this.nextBlock.animating = true;
    }
    const x = Math.floor((this.board.board[0].length - 1) / 2);
    if (this.board.board[0][x] !== 0 || this.board.board[0][x + 1]) {
      if (!this.first) {
        clearInterval(this.gameInterval);
        this.UI?.gameOver();
        return;
      }
    }
    this.UI?.animatePill();
    setTimeout(() => {
      if (this.nextBlock) {
        this.activeBlock = this.nextBlock;
        this.activeBlock.animating = false;
        this.activeBlock.applyToBoard(this.boardElement);
        this.fallingCells.push(this.activeBlock.blocks[1]);
        this.spawnBlock();
        this.nextBlock.animating = false;
      }
    }, 500);
  }
}

class Board {
  board: Array<Array<tCell>> = [];
  public deleteVirus: ((virus: Virus) => void) | undefined;
  constructor(dimmensions: { width: number; height: number }) {
    this.board = Array(dimmensions.height)
      .fill(0)
      .map(() => Array(dimmensions.width).fill(0));
  }

  public checkSameColor() {
    const deleteMap = new Map<string, Block>();
    for (let i = 0; i < this.board.length; i++) {
      const toDelete = this.checkRow(this.board[i]);
      if (toDelete.length > 0) {
        for (const block of toDelete) {
          deleteMap.set(block.ID, block);
        }
      }
    }

    for (let i = 0; i < this.board[0].length; i++) {
      const toDelete = this.checkColumn(i);
      if (toDelete.length > 0) {
        for (const block of toDelete) {
          deleteMap.set(block.ID, block);
        }
      }
    }

    for (const block of deleteMap.values()) {
      if (block instanceof Cell) {
        if (block.connected) {
          block.connected.connected = null;
          block.connected.updateGraphics();
        }
      } else if (block instanceof Virus) {
        if (this.deleteVirus) this.deleteVirus(block);
      }
      block.delete();
    }

    return this.checkFalling(deleteMap);
  }

  public addViruses(viruses: Virus[], boardElement: HTMLDivElement) {
    for (const virus of viruses) {
      virus.applyToBoard(boardElement);
    }
  }

  private checkRow(row: tCell[]) {
    const deleteMap = [] as Block[];
    const toDelete = [] as Block[];
    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      if (cell instanceof Block) {
        if (toDelete.length === 0) {
          toDelete.push(cell);
        } else {
          if (cell.color === toDelete[0].color) {
            toDelete.push(cell);
          } else {
            if (toDelete.length >= 4) {
              deleteMap.push(...toDelete);
            }
            toDelete.length = 0;
            toDelete.push(cell);
          }
        }
      } else {
        if (toDelete.length >= 4) {
          deleteMap.push(...toDelete);
        }
        toDelete.length = 0;
      }
    }
    if (toDelete.length >= 4) {
      deleteMap.push(...toDelete);
    }
    return deleteMap;
  }

  private checkColumn(column: number) {
    const deleteMap = [] as Block[];
    const toDelete = [] as Block[];
    for (let i = 0; i < this.board.length; i++) {
      const cell = this.board[i][column];
      if (cell instanceof Block) {
        if (toDelete.length === 0) {
          toDelete.push(cell);
        } else {
          if (cell.color === toDelete[0].color) {
            toDelete.push(cell);
          } else {
            if (toDelete.length >= 4) {
              deleteMap.push(...toDelete);
            }
            toDelete.length = 0;
            toDelete.push(cell);
          }
        }
      } else {
        if (toDelete.length >= 4) {
          deleteMap.push(...toDelete);
        }
        toDelete.length = 0;
      }
    }
    if (toDelete.length >= 4) {
      deleteMap.push(...toDelete);
    }
    return deleteMap;
  }

  private checkFalling(cells: Map<string, Block>) {
    if (Array.from(cells.values()).length === 0) {
      return [];
    }
    const fallingCells = new Map<string, Cell>();

    const toCheck = new Map<string, Block>();
    const checked = new Map<string, Block>();

    for (const block of cells.values()) {
      const x = block.position.x;
      const y = block.position.y;

      const cell = this.board[y - 1][x];
      if (cell instanceof Cell) {
        toCheck.set(cell.ID, cell);
        fallingCells.set(cell.ID, cell);
      }

      if (block instanceof Cell && block.connected) {
        if (!cells.has(block.connected.ID)) {
          block.connected.connected = null;
          if (this.canFall(block.connected)) {
            block.connected.falling = true;
            fallingCells.set(block.connected.ID, block.connected);
            toCheck.set(block.connected.ID, block.connected);
          }
        }
      }
    }

    while (toCheck.size > 0) {
      const block = toCheck.values().next().value;
      toCheck.delete(block.ID);
      checked.set(block.ID, block);

      const y = block.position.y;
      if (
        y - 1 >= 0 &&
        this.board[y - 1] &&
        this.board[y - 1][block.position.x] instanceof Block
      ) {
        const cell = this.board[y - 1][block.position.x];
        if (cell instanceof Cell && !checked.has(cell.ID)) {
          cell.falling = true;
          toCheck.set(cell.ID, cell);
          fallingCells.set(cell.ID, cell);
          if (cell.connected && !checked.has(cell.connected.ID)) {
            cell.connected.connected = null;
            cell.connected.falling = true;
            toCheck.set(cell.connected.ID, cell.connected);
            fallingCells.set(cell.connected.ID, cell.connected);
          }
          cell.connected = null;
        }
      }
    }
    return [...fallingCells.values()];
  }

  private canFall(block: Block) {
    if (block.position.y === this.board.length - 1) {
      return false;
    }

    if (this.board[block.position.y + 1][block.position.x] instanceof Block) {
      return false;
    }

    return true;
  }
  // ...
}

class ActiveBlock {
  animating = true;
  public blocks = {} as {
    1: Cell;
    2: Cell;
  };

  constructor(board: tBoard) {
    const x = Math.floor((board[0].length - 1) / 2);
    const y = 0;

    this.blocks = {
      1: new Cell(board, { x, y }),
      2: new Cell(board, { x: x + 1, y }),
    };
    this.blocks[1].connectBlock(this.blocks[2]);
    this.blocks[2].connectBlock(this.blocks[1]);
  }

  public applyToBoard(boardElement: HTMLDivElement | undefined) {
    if (boardElement) {
      for (const block of Object.values(this.blocks)) {
        block.applyToBoard(boardElement);
      }
    }
  }
}

class Block {
  protected board: tBoard;
  public element: HTMLDivElement;

  public position: { x: number; y: number } = { x: -1, y: -1 };
  public color: Colors = Colors.YELLOW;

  public ID = crypto.randomUUID();

  constructor(board: tBoard, position: iPosition) {
    const cell = document.createElement("div");
    cell.classList.add("blob");
    this.element = cell;
    this.board = board;
    this.position = position;
    this.color = this.createRandomColor();
    this.renderBlock();
  }

  private createRandomColor(): Colors {
    const colors = Object.values(Colors).filter(
      (v) => !isNaN(Number(v))
    ) as Colors[];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public applyToBoard(boardElement: HTMLDivElement) {
    boardElement.appendChild(this.element);
  }

  private renderBlock() {
    this.element.style.left = `${this.position.x * 24}px`;
    this.element.style.top = `${this.position.y * 24}px`;
    switch (this.color) {
      case Colors.BROWN:
        this.element.classList.add("brown");
        this.element.style.backgroundColor = "brown";
        break;
      case Colors.BLUE:
        this.element.classList.add("blue");
        this.element.style.backgroundColor = "blue";
        break;
      case Colors.YELLOW:
        this.element.classList.add("yellow");
        this.element.style.backgroundColor = "yellow";
        break;
    }
  }

  public delete() {
    this.board[this.position.y][this.position.x] = 0;
    this.element.classList.add("deleted");
    setTimeout(() => {
      this.element.remove();
    }, 100);
  }
}

class Cell extends Block {
  private rotation: 0 | 1 | 2 | 3 = 0;
  public connected: Cell | null = null;
  public falling = true;

  constructor(board: tBoard, position: iPosition) {
    super(board, position);
    this.board[position.y][position.x] = this;
    this.updateGraphics();
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
          return;
        }

        // check if there is a block below the left cell
        if (
          this.board[leftCell.position.y + 1][leftCell.position.x] instanceof
          Block
        ) {
          this.falling = false;
          this.connected.falling = false;
          return;
        }
        
        // check if there is a block below the right cell
        if (
          this.board[rightCell.position.y + 1][rightCell.position.x] instanceof
          Block
        ) {
          this.falling = false;
          this.connected.falling = false;
          return;
        }
      } else if (sameColumn) {
        // check if on the bottom
        if (bottomCell.position.y === this.board.length - 1) {
          this.falling = false;
          this.connected.falling = false;
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
    } else {
      // check if on the bottom
      if (this.position.y === this.board.length - 1) {
        this.falling = false;
        return;
      }

      // check if there is a block below
      if (this.board[this.position.y + 1][this.position.x] instanceof Block) {
        this.falling = false;
        return;
      }

      // update board
      this.board[this.position.y][this.position.x] = 0;
      this.board[this.position.y + 1][this.position.x] = this;

      // move down
      this.position.y += 1;
      this.updatePosition(this);
    }
  }

  public move(direction: Direction) {
    const moveDirection = direction === "left" ? -1 : 1;
    if (!this.connected || !this.falling) {
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

    if (!this.connected || !this.falling) {
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
    this.updateGraphics();
  }

  public connectBlock(block: Cell) {
    this.connected = block;
    this.updateGraphics();
  }

  public updateGraphics() {
    if (this.connected) {
      const removeClasses = ["single", "left", "right", "top", "bottom"];
      this.element.classList.remove(...removeClasses);
      this.connected.element.classList.remove(...removeClasses);
      this.element.classList.add("connected");
      this.connected.element.classList.add("connected");
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
        leftCell.element.classList.add("left");
        rightCell.element.classList.add("right");
      } else if (sameColumn) {
        topCell.element.classList.add("top");
        bottomCell.element.classList.add("bottom");
      }
    } else {
      const removeClasses = ["connected", "left", "right", "top", "bottom"];
      this.element.classList.remove(...removeClasses);
      this.element.classList.add("single");
    }
  }

  private updatePosition(block: Cell) {
    block.element.style.left = `${block.position.x * 24}px`;
    block.element.style.top = `${block.position.y * 24}px`;
  }
}

class Virus extends Block {
  constructor(board: tBoard) {
    const position = {
      x: 0,
      y: 0,
    };

    while (true) {
      const x = Math.floor(Math.random() * board[0].length);
      const y = Math.floor(Math.random() * (board.length - 8) + 8);
      if (board[y][x] === 0) {
        position.x = x;
        position.y = y;
        break;
      }
    }

    super(board, position);
    this.board[position.y][position.x] = this;
    this.markVirus();
  }

  private markVirus() {
    this.element.classList.add("virus");
  }
}

enum Colors {
  YELLOW,
  BLUE,
  BROWN,
}

export default Game;
export { ActiveBlock, Virus };

// Path: src/components/Game.ts
// shadcn/ui
