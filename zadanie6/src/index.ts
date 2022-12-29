const lines = {
  canvas: document.getElementById("canvas-lines") as HTMLCanvasElement,
  ctx: (
    document.getElementById("canvas-lines") as HTMLCanvasElement
  ).getContext("2d"),
  width: (document.getElementById("canvas-lines") as HTMLCanvasElement).width,
  height: (document.getElementById("canvas-lines") as HTMLCanvasElement).height,
  centerX:
    (document.getElementById("canvas-lines") as HTMLCanvasElement).width / 2,
  centerY:
    (document.getElementById("canvas-lines") as HTMLCanvasElement).height / 2,
  start: function () {
    setInterval(() => {
      this.drawLine();
    }, 1);
  },
  drawLine: function () {
    this.ctx!.beginPath();
    this.ctx!.moveTo(this.centerX, this.centerY);
    this.ctx!.lineTo(this.getRandomPoint().x, this.getRandomPoint().y);
    this.ctx!.strokeStyle = this.getRandomColor();
    this.ctx!.stroke();
  },
  getRandomColor: function () {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
    }
    return color;
  },
  getRandomPoint: function () {
    let x = Math.floor(Math.random() * this.width);
    let y = Math.floor(Math.random() * this.height);
    return { x, y };
  },
};

const arcs = {
  canvas: document.getElementById("canvas-arcs") as HTMLCanvasElement,
  ctx: (document.getElementById("canvas-arcs") as HTMLCanvasElement).getContext(
    "2d"
  ),
  width: (document.getElementById("canvas-arcs") as HTMLCanvasElement).width,
  height: (document.getElementById("canvas-arcs") as HTMLCanvasElement).height,
  x: -10,
  y: -10,
  start: function () {
    this.canvas.addEventListener("mousemove", (e) => {
      this.x = e.offsetX;
      this.y = e.offsetY;
    });
    setInterval(() => {
      this.drawArc();
    }, 10);
  },
  drawArc: function () {
    let angle = Math.floor(Math.random() * 360);
    this.ctx!.beginPath();
    this.ctx!.arc(
      this.x,
      this.y,
      10,
      this.deg2rad(angle),
      this.deg2rad(angle + 45)
    );
    this.ctx!.strokeStyle = "rgba(0, 0, 255, 0.1)";
    this.ctx!.lineWidth = 2;
    this.ctx!.stroke();
  },
  deg2rad: function (deg: number) {
    return (deg * Math.PI) / 180;
  },
};

const dvdAnimation = {
  canvas: document.getElementById("canvas-dvd") as HTMLCanvasElement,
  ctx: (document.getElementById("canvas-dvd") as HTMLCanvasElement).getContext(
    "2d"
  ),
  width: (document.getElementById("canvas-dvd") as HTMLCanvasElement).width,
  height: (document.getElementById("canvas-dvd") as HTMLCanvasElement).height,
  x: 0,
  y: 0,
  angle: 0,
  speed: 5,

  start: function () {
    let imageID = "dvd" + (Math.floor(Math.random() * 3) + 1);
    let img = document.getElementById(imageID) as HTMLImageElement;
    let imgAspectRatio = img.width / img.height;
    let imageWidth = 50;
    let imageHeight = imageWidth / imgAspectRatio;
    this.x = Math.floor(Math.random() * (this.width - imageWidth));
    this.y = Math.floor(Math.random() * (this.height - imageHeight));
    let angle = Math.floor(Math.random() * 4);
    this.angle = angle * 90 + 45;
    this.speed = Math.floor(Math.random() * 3) + 1;
    setInterval(() => {
      this.moveDVD(img, imageWidth, imageHeight);
    }, 10);
  },
  moveDVD: function (
    image: HTMLImageElement,
    imageWidth: number,
    imageHeight: number
  ) {
    this.ctx!.clearRect(0, 0, this.width, this.height);
    this.ctx!.beginPath();
    this.ctx!.drawImage(image, this.x, this.y, imageWidth, imageHeight);
    this.x += this.speed * Math.cos(this.deg2rad(this.angle));
    this.y += this.speed * Math.sin(this.deg2rad(this.angle));
    if (this.x + imageWidth > this.width || this.x < 0) {
      this.angle = 180 - this.angle;
    }
    if (this.y > this.height - imageHeight || this.y < 0) {
      this.angle = 360 - this.angle;
    }
  },
  deg2rad: function (deg: number) {
    return (deg * Math.PI) / 180;
  },
};

window.onload = () => {
  lines.start();
  arcs.start();
  dvdAnimation.start();
};
