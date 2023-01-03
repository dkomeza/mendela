class Player {
    constructor(color, canvas, player, laps) {
        this.angle = 0;
        this.speed = 2;
        this.currentLap = 0;
        this.interval = 0;
        this.color = color;
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.position = [this.width / 2 - 2, this.height - 60 + player * 10];
        this.activeKeys = {
            left: false,
            right: false,
        };
        this.laps = laps;
    }
    createPlayer() {
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.moveTo(this.position[0], this.position[1]);
        this.context.lineTo(this.position[0] + 5, this.position[1]);
        this.context.closePath();
        this.context.stroke();
    }
    movePlayer() {
        this.context.beginPath();
        this.context.moveTo(this.position[0], this.position[1]);
        this.position[0] += this.speed * Math.cos(this.deg2rad(this.angle));
        this.position[1] += this.speed * Math.sin(this.deg2rad(this.angle));
        this.context.lineTo(this.position[0], this.position[1]);
        this.context.closePath();
        this.context.stroke();
    }
    createInterval() {
        this.interval = setInterval(() => {
            this.tick();
        }, 1000 / 60);
    }
    tick() {
        if (this.activeKeys.left) {
            this.angle -= 2;
        }
        else if (this.activeKeys.right) {
            this.angle += 2;
        }
        this.movePlayer();
        if (this.checkCollision()) {
            this.speed = 0;
            clearInterval(this.interval);
            console.log("Kolizja");
        }
        this.checkFinishLine();
    }
    createControls(player) {
        switch (player) {
            case 1:
                document.addEventListener("keydown", (e) => {
                    if (e.key === "ArrowLeft") {
                        this.activeKeys.left = true;
                    }
                    if (e.key === "ArrowRight") {
                        this.activeKeys.right = true;
                    }
                    if (e.key === "Escape") {
                        this.speed ? (this.speed = 0) : (this.speed = 2);
                    }
                });
                document.addEventListener("keyup", (e) => {
                    if (e.key === "ArrowLeft") {
                        this.activeKeys.left = false;
                    }
                    if (e.key === "ArrowRight") {
                        this.activeKeys.right = false;
                    }
                });
                break;
        }
    }
    checkFinishLine() {
        if (this.position[0] >= this.width / 2 - 1 &&
            this.position[0] < this.width / 2 + 1 &&
            this.position[1] >= this.height - 75 &&
            this.position[1] < this.height) {
            if (this.currentLap === this.laps) {
                this.context.fillStyle = "green";
                this.context.fillRect(this.width / 2 - 50, this.height / 2 - 20, 100, 40);
                this.context.font = "20px Arial black";
                this.context.textAlign = "center";
                this.context.fillStyle = "black";
                this.context.fillText(`Winner!`, this.width / 2, this.height / 2);
                this.speed = 0;
                clearInterval(this.interval);
                return;
            }
            this.currentLap++;
            this.updateCurrentLap();
        }
    }
    updateCurrentLap() {
        this.context.fillStyle = "green";
        this.context.fillRect(this.width / 2 - 50, this.height / 2 - 20, 100, 40);
        this.context.font = "20px Arial black";
        this.context.textAlign = "center";
        this.context.fillStyle = "black";
        this.context.fillText(`Lap: ${this.currentLap}/${this.laps}`, this.width / 2, this.height / 2);
    }
    checkCollision() {
        if (this.position[0] < 0 || this.position[0] > this.width) {
            return true;
        }
        else if (this.position[0] > 0 && this.position[0] < this.height / 2) {
            const distance = Math.sqrt(Math.pow(this.position[0] - this.height / 2, 2) +
                Math.pow(this.position[1] - this.height / 2, 2));
            if (distance > this.height / 2 || distance < this.height / 4) {
                console.log(distance);
                console.log("upsik");
                return true;
            }
        }
        else if (this.position[0] > this.height / 2 &&
            this.position[0] < this.width - this.height / 2) {
            if (this.position[1] < 0 ||
                this.position[1] > this.height ||
                (this.position[1] > this.height / 4 &&
                    this.position[1] < this.height - this.height / 4)) {
                return true;
            }
        }
        else if (this.position[0] > this.width - this.height / 2 &&
            this.position[0] < this.width) {
            const distance = Math.sqrt(Math.pow(this.position[0] - (this.width - this.height / 2), 2) +
                Math.pow(this.position[1] - this.height / 2, 2));
            if (distance > this.height / 2 || distance < this.height / 4) {
                console.log(distance);
                console.log("upsik");
                return true;
            }
        }
    }
    deg2rad(deg) {
        return (Math.PI / 180) * deg;
    }
}
export default Player;
//# sourceMappingURL=Player.js.map