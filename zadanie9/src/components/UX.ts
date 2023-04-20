import Game from "./Game";

class UX {
  game: Game | undefined;
  private keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
    z: false,
    x: false,
  };
  setGame(game: Game) {
    this.game = game;
  }
  handleKeyDown(key: string) {
    if (key === "ArrowLeft" && !this.keys.ArrowLeft) {
      this.game?.move("left");
      this.keys.ArrowLeft = true;
    } else if (key === "ArrowRight" && !this.keys.ArrowRight) {
      this.game?.move("right");
      this.keys.ArrowRight = true;
    } else if (key === "ArrowDown" && !this.keys.ArrowDown) {
      this.game?.fastDrop();
      this.keys.ArrowDown = true;
    } else if (key === "z" && !this.keys.z) {
      this.game?.rotate("left");
      this.keys.z = true;
    } else if (key === "x" && !this.keys.x) {
      this.game?.rotate("right");
      this.keys.x = true;
    }
  }

  handleKeyUp(key: string) {
    if (key === "ArrowLeft" && this.keys.ArrowLeft) {
      this.keys.ArrowLeft = false;
    } else if (key === "ArrowRight" && this.keys.ArrowRight) {
      this.keys.ArrowRight = false;
    } else if (key === "ArrowDown" && this.keys.ArrowDown) {
      this.keys.ArrowDown = false;
    } else if (key === "z" && this.keys.z) {
      this.keys.z = false;
    } else if (key === "x" && this.keys.x) {
      this.keys.x = false;
    }
  }

  addEventListener() {
    window.onkeydown = (e) => {
      const key = e.key;
      this.handleKeyDown(key);
    };
    window.onkeyup = (e) => {
      const key = e.key;
      this.handleKeyUp(key);
    };
    this.addButtons();
  }

  addButtons() {
    document.getElementById("left")!.addEventListener("click", () => {
      this.game?.move("left");
    });
    document.getElementById("right")!.addEventListener("click", () => {
      this.game?.move("right");
    });
    document.getElementById("down")!.addEventListener("click", () => {
      this.game?.fastDrop();
    });
    document.getElementById("rotateLeft")!.addEventListener("click", () => {
      this.game?.rotate("left");
    });
    document.getElementById("rotateRight")!.addEventListener("click", () => {
      this.game?.rotate("right");
    });
  }
}

export default new UX();
