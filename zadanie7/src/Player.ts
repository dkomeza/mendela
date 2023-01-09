interface activeKeys {
  left: boolean;
  right: boolean;
}

class Player {
  color: string;
  position: number[];
  angle: number = 0;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  speed: number = 120;
  activeKeys: activeKeys;
  currentLap: number = 1;
  laps: number;
  tracks: number[][] = [];
  player: number;
  finishLine = false;
  constructor(canvas: HTMLCanvasElement, player: number, laps: number) {
    this.color = this.getColor(player, 1);
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.position = [this.width / 2 - 2, this.height - 60 + player * 10];
    this.speed = (canvas.width + canvas.height) / 10;
    this.activeKeys = {
      left: false,
      right: false,
    };
    this.laps = laps;
    this.player = player;
  }

  getColor(player: number, alpha: number) {
    switch (player) {
      case 1:
        return `rgba(255, 0, 0, ${alpha})`;
      case 2:
        return `rgba(0, 0, 255, ${alpha})`;
      case 3:
        return `rgba(0, 255, 0, ${alpha})`;
      case 4:
        return `rgba(255, 255, 0, ${alpha})`;
      default:
        return "black";
    }
  }

  getImage(player: number) {
    switch (player) {
      case 1:
        return "./assets/red.png";
      case 2:
        return "./assets/blue.png";
      case 3:
        return "./assets/green.png";
      case 4:
        return "./assets/yellow.png";
      default:
        return "black";
    }
  }

  createPlayer() {
    this.tracks.push([
      this.position[0],
      this.position[1],
      this.position[0] + 5,
      this.position[1],
    ]);
    this.position[0] += 5;
  }

  movePlayer(delta: number) {
    const finalSpeed = this.speed * (delta / 1000);
    const currentPosition = [this.position[0], this.position[1]];
    this.position[0] += finalSpeed * Math.cos(this.deg2rad(this.angle));
    this.position[1] += finalSpeed * Math.sin(this.deg2rad(this.angle));
    this.tracks.unshift([
      currentPosition[0],
      currentPosition[1],
      this.position[0],
      this.position[1],
    ]);
    if (this.tracks.length > 400) {
      this.tracks.pop();
    }
  }

  fadePlayer(dead: boolean = false) {
    this.context.strokeStyle = this.color;
    this.context.lineWidth = (this.width + this.height) / 360;
    if (dead) {
      for (let i = 0; i < this.tracks.length; i++) {
        const alpha = (this.tracks.length - i) / this.tracks.length;
        this.context.strokeStyle = this.getColor(this.player, alpha);
        this.context.beginPath();
        this.context.moveTo(this.tracks[i][0], this.tracks[i][1]);
        this.context.lineTo(this.tracks[i][2], this.tracks[i][3]);
        this.context.stroke();
      }
    } else {
      for (let i = 0; i < this.tracks.length; i++) {
        if (i > this.tracks.length / 2) {
          const alpha = (this.tracks.length - i) / (this.tracks.length / 2);
          this.context.strokeStyle = this.getColor(this.player, alpha);
        } else {
          this.context.strokeStyle = this.getColor(this.player, 1);
        }
        this.context.beginPath();
        this.context.moveTo(this.tracks[i][0], this.tracks[i][1]);
        this.context.lineTo(this.tracks[i][2], this.tracks[i][3]);
        this.context.stroke();
      }
    }
    this.context.save();
    this.context.translate(this.position[0], this.position[1]);
    this.context.rotate(this.deg2rad(this.angle + 90));
    const image = new Image();
    image.src = this.getImage(this.player);
    const imgWidth = this.canvas.width / 10;
    const imgHeight = this.canvas.height / 10;
    this.context.drawImage(
      image,
      -imgWidth / 2,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );
    this.context.restore();
  }

  tick(delta: number) {
    if (this.activeKeys.left) {
      this.angle -= 125 * (delta / 1000);
    } else if (this.activeKeys.right) {
      this.angle += 125 * (delta / 1000);
    }
    this.movePlayer(delta);
    this.fadePlayer();
    this.updateCurrentLap();
  }

  createControls(player: number) {
    switch (player) {
      case 1:
        document.addEventListener("keydown", (e) => {
          if (e.key === "a") {
            this.activeKeys.left = true;
          }
          if (e.key === "d") {
            this.activeKeys.right = true;
          }
        });
        document.addEventListener("keyup", (e) => {
          if (e.key === "a") {
            this.activeKeys.left = false;
          }
          if (e.key === "d") {
            this.activeKeys.right = false;
          }
        });
        break;
      case 2:
        document.addEventListener("keydown", (e) => {
          if (e.key === "f") {
            this.activeKeys.left = true;
          }
          if (e.key === "h") {
            this.activeKeys.right = true;
          }
        });
        document.addEventListener("keyup", (e) => {
          if (e.key === "f") {
            this.activeKeys.left = false;
          }
          if (e.key === "h") {
            this.activeKeys.right = false;
          }
        });
        break;
      case 3:
        document.addEventListener("keydown", (e) => {
          if (e.key === "j") {
            this.activeKeys.left = true;
          }
          if (e.key === "l") {
            this.activeKeys.right = true;
          }
        });
        document.addEventListener("keyup", (e) => {
          if (e.key === "j") {
            this.activeKeys.left = false;
          }
          if (e.key === "l") {
            this.activeKeys.right = false;
          }
        });
        break;
    }
  }

  checkFinishLine() {
    if (
      this.position[1] >= this.height - this.height / 4 &&
      this.position[1] < this.height
    ) {
      if (
        this.finishLine &&
        this.position[0] >= this.width / 2 - 1 &&
        this.position[0] < this.width / 2
      ) {
        if (this.currentLap === this.laps) {
          this.context.fillStyle = "green";
          this.context.fillRect(
            this.width / 2 - 50,
            this.height / 2 - 20,
            100,
            40
          );
          this.context.font = "20px Arial black";
          this.context.textAlign = "center";
          this.context.fillStyle = "black";
          this.context.fillText(`Winner!`, this.width / 2, this.height / 2);
          this.speed = 0;
          return true;
        }
        this.finishLine = false;
        this.currentLap++;
        this.updateCurrentLap();
      } else if (this.position[0] >= this.width / 2 + 20 && !this.finishLine) {
        console.log("Enabled finish line");
        this.finishLine = true;
      }
    }
    return false;
  }

  updateCurrentLap() {
    this.context.fillStyle = "green";
    this.context.fillRect(this.width / 2 - 50, this.height / 2 - 20, 100, 40);
    this.context.font = "20px Arial black";
    this.context.textAlign = "center";
    this.context.fillStyle = "black";
    this.context.fillText(
      `Lap: ${this.currentLap}/${this.laps}`,
      this.width / 2,
      this.height / 2
    );
  }

  checkCollision() {
    if (this.position[0] < 0 || this.position[0] > this.width) {
      return true;
    } else if (this.position[0] > 0 && this.position[0] < this.height / 2) {
      const distance = Math.sqrt(
        Math.pow(this.position[0] - this.height / 2, 2) +
          Math.pow(this.position[1] - this.height / 2, 2)
      );
      if (distance > this.height / 2 || distance < this.height / 4) {
        console.log(distance);
        console.log("upsik");
        return true;
      }
    } else if (
      this.position[0] > this.height / 2 &&
      this.position[0] < this.width - this.height / 2
    ) {
      if (
        this.position[1] < 0 ||
        this.position[1] > this.height ||
        (this.position[1] > this.height / 4 &&
          this.position[1] < this.height - this.height / 4)
      ) {
        return true;
      }
    } else if (
      this.position[0] > this.width - this.height / 2 &&
      this.position[0] < this.width
    ) {
      const distance = Math.sqrt(
        Math.pow(this.position[0] - (this.width - this.height / 2), 2) +
          Math.pow(this.position[1] - this.height / 2, 2)
      );
      if (distance > this.height / 2 || distance < this.height / 4) {
        console.log(distance);
        console.log("upsik");
        return true;
      }
    }
  }

  deg2rad(deg: number) {
    return (Math.PI / 180) * deg;
  }
}

export default Player;
