class Player {
    constructor(canvas, player, laps) {
        this.angle = 0;
        this.speed = 120;
        this.currentLap = 1;
        this.tracks = [];
        this.finishLine = false;
        this.color = this.getColor(player, 1);
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.position = [
            this.width / 2 - 2,
            this.height - this.height * 0.25 + (player * this.height) / 20,
        ];
        this.speed = (canvas.width + canvas.height) / 10;
        this.activeKeys = {
            left: false,
            right: false,
        };
        this.laps = laps;
        this.player = player;
        const image = new Image();
        image.src = this.getImage(player);
        this.image = image;
        image.onload = () => {
            this.image = image;
            this.tick(0);
        };
    }
    getColor(player, alpha) {
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
    getImage(player) {
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
    movePlayer(delta) {
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
    fadePlayer(dead = false) {
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
        }
        else {
            for (let i = 0; i < this.tracks.length; i++) {
                if (i > this.tracks.length / 2) {
                    const alpha = (this.tracks.length - i) / (this.tracks.length / 2);
                    this.context.strokeStyle = this.getColor(this.player, alpha);
                }
                else {
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
        this.context.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        this.context.restore();
    }
    tick(delta) {
        if (this.activeKeys.left) {
            this.angle -= 125 * (delta / 1000);
        }
        else if (this.activeKeys.right) {
            this.angle += 125 * (delta / 1000);
        }
        this.movePlayer(delta);
        this.fadePlayer();
        return this.currentLap;
    }
    createControls(keys) {
        document.addEventListener("keydown", (e) => {
            if (e.key === keys.left) {
                this.activeKeys.left = true;
            }
            if (e.key === keys.right) {
                this.activeKeys.right = true;
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === keys.left) {
                this.activeKeys.left = false;
            }
            if (e.key === keys.right) {
                this.activeKeys.right = false;
            }
        });
    }
    checkFinishLine() {
        if (this.position[1] >= this.height - this.height / 4 &&
            this.position[1] < this.height) {
            if (this.finishLine &&
                this.position[0] >= this.width / 2 &&
                this.position[0] < this.width / 2 + 10) {
                console.log(this.player);
                if (this.currentLap === this.laps) {
                    this.speed = 0;
                    return true;
                }
                this.finishLine = false;
                this.currentLap++;
            }
            else if (this.position[0] >= this.width / 2 + 20 && !this.finishLine) {
                this.finishLine = true;
            }
        }
        return false;
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