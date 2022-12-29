var lines = {
    canvas: document.getElementById("canvas-lines"),
    ctx: document.getElementById("canvas-lines").getContext("2d"),
    width: document.getElementById("canvas-lines").width,
    height: document.getElementById("canvas-lines").height,
    centerX: document.getElementById("canvas-lines").width / 2,
    centerY: document.getElementById("canvas-lines").height / 2,
    start: function () {
        var _this = this;
        setInterval(function () {
            _this.drawLine();
        }, 1);
    },
    drawLine: function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(this.getRandomPoint().x, this.getRandomPoint().y);
        this.ctx.strokeStyle = this.getRandomColor();
        this.ctx.stroke();
    },
    getRandomColor: function () {
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10);
        }
        return color;
    },
    getRandomPoint: function () {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        return { x: x, y: y };
    }
};
var arcs = {
    canvas: document.getElementById("canvas-arcs"),
    ctx: document.getElementById("canvas-arcs").getContext("2d"),
    width: document.getElementById("canvas-arcs").width,
    height: document.getElementById("canvas-arcs").height,
    x: -10,
    y: -10,
    start: function () {
        var _this = this;
        this.canvas.addEventListener("mousemove", function (e) {
            _this.x = e.offsetX;
            _this.y = e.offsetY;
        });
        setInterval(function () {
            _this.drawArc();
        }, 10);
    },
    drawArc: function () {
        var angle = Math.floor(Math.random() * 360);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 10, this.deg2rad(angle), this.deg2rad(angle + 45));
        this.ctx.strokeStyle = "rgba(0, 0, 255, 0.1)";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    },
    deg2rad: function (deg) {
        return (deg * Math.PI) / 180;
    }
};
var dvdAnimation = {
    canvas: document.getElementById("canvas-dvd"),
    ctx: document.getElementById("canvas-dvd").getContext("2d"),
    width: document.getElementById("canvas-dvd").width,
    height: document.getElementById("canvas-dvd").height,
    x: 0,
    y: 0,
    angle: 0,
    speed: 5,
    start: function () {
        var _this = this;
        var imageID = "dvd" + (Math.floor(Math.random() * 3) + 1);
        var img = document.getElementById(imageID);
        var imgAspectRatio = img.width / img.height;
        var imageWidth = 50;
        var imageHeight = imageWidth / imgAspectRatio;
        this.x = Math.floor(Math.random() * (this.width - imageWidth));
        this.y = Math.floor(Math.random() * (this.height - imageHeight));
        var angle = Math.floor(Math.random() * 4);
        this.angle = angle * 90 + 45;
        this.speed = Math.floor(Math.random() * 3) + 1;
        setInterval(function () {
            _this.moveDVD(img, imageWidth, imageHeight);
        }, 10);
    },
    moveDVD: function (image, imageWidth, imageHeight) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();
        this.ctx.drawImage(image, this.x, this.y, imageWidth, imageHeight);
        this.x += this.speed * Math.cos(this.deg2rad(this.angle));
        this.y += this.speed * Math.sin(this.deg2rad(this.angle));
        if (this.x + imageWidth > this.width || this.x < 0) {
            this.angle = 180 - this.angle;
        }
        if (this.y > this.height - imageHeight || this.y < 0) {
            this.angle = 360 - this.angle;
        }
    },
    deg2rad: function (deg) {
        return (deg * Math.PI) / 180;
    }
};
window.onload = function () {
    lines.start();
    arcs.start();
    dvdAnimation.start();
};
