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
  speed = 800; // 0 - 999
  fastSpeed = 950;
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
    this.nextBlock!.animating = true;
    this.animatePill();
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
      if (this.activeBlock) {
        if (!this.activeBlock.canFall()) {
          this.stopFastDrop();
          this.activeBlock = undefined;
        } else {
          this.activeBlock.fall();
        }
      } else if (this.fallingCells.length > 0) {
        // sort by lowest to highest
        this.fallingCells.sort((a, b) => {
          return b.position.y - a.position.y;
        });
        this.moveCells();
      } else {
        this.fallingCells = this.board.checkSameColor();
        if (!(this.fallingCells.length > 0)) {
          if (this.viruses.length > 0) {
            this.animatePill();
          }
        }
      }
    }
    if (this.first) {
      this.first = false;
    }
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
      this.activeBlock.move(direction);
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
      this.activeBlock.rotate(direction);
    }
  }

  /**
   * Starts fast drop mode.
   * @memberof Game
   * @method startFastDrop
   * @returns {void}
   */
  public fastDrop(): void {
    if (this.activeBlock && !this.fastMode) {
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

  public addViruses(viruses: Virus[], boardElement: HTMLDivElement) {
    for (const virus of viruses) {
      virus.applyToBoard(boardElement);
    }
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

    if (deleteMap.size > 0) {
      return this.checkFalling();
    } else {
      return [];
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

  private checkFalling() {
    const falling = [] as Cell[];

    for (let i = this.board.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.board[i].length; j++) {
        const cell = this.board[i][j];
        if (cell instanceof Cell) {
          if (cell.canFall()) {
            if (cell.connected) {
              if (cell.connected.canFall()) {
                falling.push(cell);
                cell.connected.falling = true;
                cell.connected = null;
                cell.updateGraphics();
              }
            } else {
              falling.push(cell);
              cell.updateGraphics();
              cell.falling = true;
            }
          }
        }
      }
    }

    return falling;
  }
}

class ActiveBlock {
  animating = true;
  public blocks = {} as {
    1: Cell;
    2: Cell;
  };
  board: tBoard;

  constructor(board: tBoard) {
    const x = Math.floor((board[0].length - 1) / 2);
    const y = 0;

    this.blocks = {
      1: new Cell(board, { x, y }),
      2: new Cell(board, { x: x + 1, y }),
    };
    this.blocks[1].connectBlock(this.blocks[2]);
    this.blocks[2].connectBlock(this.blocks[1]);

    this.board = board;
  }

  public applyToBoard(boardElement: HTMLDivElement | undefined) {
    if (boardElement) {
      for (const block of Object.values(this.blocks)) {
        block.applyToBoard(boardElement);
      }
    }
  }

  public fall() {
    if (!this.canFall()) {
      return;
    }

    this.board[this.blocks[1].position.y][this.blocks[1].position.x] = 0;
    this.board[this.blocks[2].position.y][this.blocks[2].position.x] = 0;

    this.blocks[1].position.y++;
    this.blocks[2].position.y++;

    this.board[this.blocks[1].position.y][this.blocks[1].position.x] =
      this.blocks[1];
    this.board[this.blocks[2].position.y][this.blocks[2].position.x] =
      this.blocks[2];

    this.blocks[1].updatePosition(this.blocks[1]);
    this.blocks[2].updatePosition(this.blocks[2]);
  }

  public canFall() {
    if (this.blocks[1].canFall() && this.blocks[2].canFall()) {
      return true;
    }
    this.blocks[1].falling = false;
    this.blocks[2].falling = false;
    return false;
  }

  public move(direction: "left" | "right") {
    const moveDirection = direction === "left" ? -1 : 1;
    if (this.canMove(direction)) {
      // update board
      this.board[this.blocks[1].position.y][this.blocks[1].position.x] = 0;
      this.board[this.blocks[2].position.y][this.blocks[2].position.x] = 0;

      this.board[this.blocks[1].position.y][
        this.blocks[1].position.x + moveDirection
      ] = this.blocks[1];
      this.board[this.blocks[2].position.y][
        this.blocks[2].position.x + moveDirection
      ] = this.blocks[2];

      // move
      this.blocks[1].position.x += moveDirection;
      this.blocks[1].updatePosition(this.blocks[1]);
      this.blocks[2].position.x += moveDirection;
      this.blocks[2].updatePosition(this.blocks[2]);
    }
  }

  private canMove(direction: "left" | "right") {
    const moveDirection = direction === "left" ? -1 : 1;

    const sameRow = this.blocks[1].position.y === this.blocks[2].position.y;

    if (sameRow) {
      const leftBlock =
        this.blocks[1].position.x < this.blocks[2].position.x
          ? this.blocks[1]
          : this.blocks[2];
      const rightBlock =
        this.blocks[1].position.x > this.blocks[2].position.x
          ? this.blocks[1]
          : this.blocks[2];

      if (leftBlock.position.x + moveDirection < 0) {
        return false;
      }

      if (rightBlock.position.x + moveDirection >= this.board[0].length) {
        return false;
      }

      if (direction === "left") {
        if (this.board[leftBlock.position.y][leftBlock.position.x - 1]) {
          return false;
        }
      } else {
        if (this.board[rightBlock.position.y][rightBlock.position.x + 1]) {
          return false;
        }
      }
    } else {
      const topBlock =
        this.blocks[1].position.y < this.blocks[2].position.y
          ? this.blocks[1]
          : this.blocks[2];
      const bottomBlock =
        this.blocks[1].position.y > this.blocks[2].position.y
          ? this.blocks[1]
          : this.blocks[2];

      if (bottomBlock.position.x + moveDirection >= this.board[0].length) {
        return false;
      }

      if (bottomBlock.position.x + moveDirection < 0) {
        return false;
      }

      if (
        this.board[topBlock.position.y][topBlock.position.x + moveDirection]
      ) {
        return false;
      }

      if (
        this.board[bottomBlock.position.y][
          bottomBlock.position.x + moveDirection
        ]
      ) {
        return false;
      }
    }

    return true;
  }

  public rotate(direction: "left" | "right") {
    const previousPosition1 = { ...this.blocks[1].position };
    const previousPosition2 = { ...this.blocks[2].position };

    const sameRow = this.blocks[1].position.y === this.blocks[2].position.y;

    if (sameRow) {
      const leftBlock =
        this.blocks[1].position.x < this.blocks[2].position.x
          ? this.blocks[1]
          : this.blocks[2];
      const rightBlock =
        this.blocks[1].position.x > this.blocks[2].position.x
          ? this.blocks[1]
          : this.blocks[2];

      if (direction === "left") {
        if (rightBlock.position.x - 1 < 0 || rightBlock.position.y - 1 < 0) {
          return;
        }
        rightBlock.position.x--;
        rightBlock.position.y--;
      }
      if (direction === "right") {
        if (rightBlock.position.x - 1 < 0 || leftBlock.position.y - 1 < 0) {
          return;
        }
        rightBlock.position.x--;
        leftBlock.position.y--;
      }
    } else {
      const topBlock =
        this.blocks[1].position.y < this.blocks[2].position.y
          ? this.blocks[1]
          : this.blocks[2];
      const bottomBlock =
        this.blocks[1].position.y > this.blocks[2].position.y
          ? this.blocks[1]
          : this.blocks[2];

      if (direction === "left") {
        if (bottomBlock.position.x + 1 > this.board[0].length - 1) {
          topBlock.position.x--;
          bottomBlock.position.x--;
        }
        topBlock.position.y++;
        bottomBlock.position.x++;
      }
      if (direction === "right") {
        if (topBlock.position.x + 1 > this.board[0].length - 1) {
          topBlock.position.x--;
          bottomBlock.position.x--;
        }
        topBlock.position.x++;
        topBlock.position.y++;
      }
    }

    this.board[previousPosition1.y][previousPosition1.x] = 0;
    this.board[previousPosition2.y][previousPosition2.x] = 0;

    if (
      this.board[this.blocks[1].position.y][this.blocks[1].position.x] ||
      this.board[this.blocks[2].position.y][this.blocks[2].position.x]
    ) {
      this.blocks[1].position = previousPosition1;
      this.blocks[2].position = previousPosition2;

      this.board[previousPosition1.y][previousPosition1.x] = this.blocks[1];
      this.board[previousPosition2.y][previousPosition2.x] = this.blocks[2];

      return;
    }

    this.board[this.blocks[1].position.y][this.blocks[1].position.x] =
      this.blocks[1];
    this.board[this.blocks[2].position.y][this.blocks[2].position.x] =
      this.blocks[2];

    this.blocks[1].updatePosition(this.blocks[1]);
    this.blocks[2].updatePosition(this.blocks[2]);
    this.blocks[1].updateGraphics();
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
  public connected: Cell | null = null;
  public falling = true;

  constructor(board: tBoard, position: iPosition) {
    super(board, position);
    this.board[position.y][position.x] = this;
    this.updateGraphics();
  }

  public fall() {
    if (!this.canFall()) {
      this.falling = false;
      if (this.connected) {
        this.connected.falling = false;
      }
      return;
    }

    if (this.connected) {
      this.connected = null;
    }

    // update board
    this.board[this.position.y][this.position.x] = 0;
    this.board[this.position.y + 1][this.position.x] = this;

    // move down
    this.position.y += 1;
    this.updatePosition(this);
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

  public canFall() {
    if (this.position.y + 1 >= this.board.length) {
      return false;
    }

    // check block below
    if (this.board[this.position.y + 1][this.position.x] !== 0) {
      const checkBlock = this.board[this.position.y + 1][this.position.x];

      if (checkBlock instanceof Cell) {
        if (!checkBlock.falling) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  }

  public updatePosition(block: Cell) {
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
export { ActiveBlock, Virus, Block, Cell, Colors, Board };
export type { tBoard, tCell, iPosition, Direction };
// Path: src/components/Game.ts
// shadcn/ui
