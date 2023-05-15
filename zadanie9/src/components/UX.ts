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

  elements = {
    ArrowLeft: document.getElementById("left"),
    ArrowRight: document.getElementById("right"),
    ArrowDown: document.getElementById("down"),
    z: document.getElementById("rotateLeft"),
    x: document.getElementById("rotateRight"),
  };

  setGame(game: Game) {
    this.game = game;
  }
  handleKeyDown(key: string) {
    if (key === "ArrowLeft" && !this.keys.ArrowLeft) {
      this.game?.move("left");
      this.keys.ArrowLeft = true;
      this.elements.ArrowLeft?.classList.add("pressed");
    } else if (key === "ArrowRight" && !this.keys.ArrowRight) {
      this.game?.move("right");
      this.keys.ArrowRight = true;
      this.elements.ArrowRight?.classList.add("pressed");
    } else if (key === "ArrowDown" && !this.keys.ArrowDown) {
      this.game?.fastDrop();
      this.keys.ArrowDown = true;
      this.elements.ArrowDown?.classList.add("pressed");
    } else if (key === "z" && !this.keys.z) {
      this.game?.rotate("left");
      this.keys.z = true;
      this.elements.z?.classList.add("pressed");
    } else if (key === "x" && !this.keys.x) {
      this.game?.rotate("right");
      this.keys.x = true;
      this.elements.x?.classList.add("pressed");
    }
  }

  handleKeyUp(key: string) {
    if (key === "ArrowLeft" && this.keys.ArrowLeft) {
      this.keys.ArrowLeft = false;
      this.elements.ArrowLeft?.classList.remove("pressed");
    } else if (key === "ArrowRight" && this.keys.ArrowRight) {
      this.keys.ArrowRight = false;
      this.elements.ArrowRight?.classList.remove("pressed");
    } else if (key === "ArrowDown" && this.keys.ArrowDown) {
      this.keys.ArrowDown = false;
      this.elements.ArrowDown?.classList.remove("pressed");
    } else if (key === "z" && this.keys.z) {
      this.keys.z = false;
      this.elements.z?.classList.remove("pressed");
    } else if (key === "x" && this.keys.x) {
      this.keys.x = false;
      this.elements.x?.classList.remove("pressed");
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
export { UX };