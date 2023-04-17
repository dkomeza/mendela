import Game from "./Game";

class UX {
  private keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
    z: false,
    x: false,
  };
  handleKeyDown(key: string) {
    if (key === "ArrowLeft" && !this.keys.ArrowLeft) {
      Game.move("left");
      this.keys.ArrowLeft = true;
    } else if (key === "ArrowRight" && !this.keys.ArrowRight) {
      Game.move("right");
      this.keys.ArrowRight = true;
    } else if (key === "ArrowDown" && !this.keys.ArrowDown) {
      Game.fastDrop();
      this.keys.ArrowDown = true;
    } else if (key === "z" && !this.keys.z) {
      Game.rotate("left");
      this.keys.z = true;
    } else if (key === "x" && !this.keys.x) {
      Game.rotate("right");
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
  }
}

export default new UX();
