class Track {
    constructor(canvas) {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.canvas = canvas;
        this.canvas.style.opacity = "0";
        this.context = canvas.getContext("2d");
        const image = new Image();
        image.src = "assets/grass.jpeg";
        this.pattern = this.context.createPattern(image, "repeat");
        image.onload = () => {
            this.pattern = this.context.createPattern(image, "repeat");
            this.canvas.style.opacity = "1";
            this.drawField();
        };
    }
    drawField() {
        this.drawBackground();
        this.drawCurves();
        this.drawStraight();
        this.drawCenter();
    }
    drawBackground() {
        this.context.fillStyle = this.pattern;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    drawCurves() {
        this.context.fillStyle = "#964B00";
        this.context.beginPath();
        this.context.arc(this.height / 2, this.height / 2, this.height / 2, this.deg2rad(90), this.deg2rad(270));
        this.context.closePath();
        this.context.fill();
        this.context.moveTo(this.width - this.height / 2, 0);
        this.context.beginPath();
        this.context.arc(this.width - this.height / 2, this.height / 2, this.height / 2, this.deg2rad(90), this.deg2rad(270), true);
        this.context.closePath();
        this.context.fill();
    }
    drawStraight() {
        this.context.fillStyle = "#964B00";
        this.context.fillRect(this.height / 2 - 1, 0, this.width - this.height + 2, this.height);
    }
    drawCenter() {
        this.context.fillStyle = this.pattern;
        this.context.beginPath();
        this.context.arc(this.height / 2, this.height / 2, this.height / 4, 0, this.deg2rad(360));
        this.context.closePath();
        this.context.fill();
        this.context.beginPath();
        this.context.arc(this.width - this.height / 2, this.height / 2, this.height / 4, 0, this.deg2rad(360));
        this.context.closePath();
        this.context.fill();
        this.context.fillRect(this.height / 2, this.height / 4, this.width - this.height, this.height - this.height / 2);
    }
    updateCurrentLap(currentLap, laps) {
        this.context.fillStyle = "#964B00";
        this.context.fillRect(this.width / 2 - 60, this.height / 2 - 30, 120, 50);
        this.context.fillRect(this.width / 2 - 40, this.height / 2 + 20, 10, 30);
        this.context.fillRect(this.width / 2 + 30, this.height / 2 + 20, 10, 30);
        this.context.font = "20px Arial black";
        this.context.textAlign = "center";
        this.context.fillStyle = "white";
        this.context.fillText(`Lap: ${currentLap}/${laps}`, this.width / 2, this.height / 2);
    }
    deg2rad(deg) {
        return (Math.PI / 180) * deg;
    }
}
export default Track;
//# sourceMappingURL=Track.js.map