class Track {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
  }

  drawField() {
    this.drawBackground();
    this.drawCurves();
    this.drawStraight();
    this.drawCenter();
  }

  drawBackground() {
    this.context.fillStyle = "green";
    this.context.fillRect(0, 0, this.width, this.height);
  }

  drawCurves() {
    this.context.fillStyle = "#964B00";
    this.context.beginPath();
    this.context.arc(
      this.height / 2,
      this.height / 2,
      this.height / 2,
      this.deg2rad(90),
      this.deg2rad(270)
    );
    this.context.closePath();
    this.context.fill();
    this.context.moveTo(this.width - this.height / 2, 0);
    this.context.beginPath();
    this.context.arc(
      this.width - this.height / 2,
      this.height / 2,
      this.height / 2,
      this.deg2rad(90),
      this.deg2rad(270),
      true
    );
    this.context.closePath();
    this.context.fill();
  }

  drawStraight() {
    this.context.fillStyle = "#964B00";
    this.context.fillRect(
      this.height / 2,
      0,
      this.width - this.height,
      this.height
    );
  }

  drawCenter() {
    this.context.fillStyle = "green";
    this.context.beginPath();
    this.context.arc(
      this.height / 2,
      this.height / 2,
      this.height / 4,
      0,
      this.deg2rad(360)
    );
    this.context.closePath();
    this.context.fill();
    this.context.beginPath();
    this.context.arc(
      this.width - this.height / 2,
      this.height / 2,
      this.height / 4,
      0,
      this.deg2rad(360)
    );
    this.context.closePath();
    this.context.fill();
    this.context.fillRect(
      this.height / 2,
      this.height / 4,
      this.width - this.height,
      this.height - this.height / 2
    );
  }

  deg2rad(deg: number) {
    return (Math.PI / 180) * deg;
  }
}

export default Track;
