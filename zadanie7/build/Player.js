class Player {
    constructor(color, canvas, player) {
        this.angle = 0;
        this.speed = 0;
        this.color = color;
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.position = [this.width / 2, this.height - 25];
        this.activeKeys = {
            left: false,
            right: false,
        };
        this.createControls(player);
    }
    createPlayer() {
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.moveTo(this.position[0], this.position[1]);
        this.context.lineTo(this.position[0] + 5, this.position[1]);
        this.context.stroke();
    }
    movePlayer() {
        this.context.beginPath();
        this.context.moveTo(this.position[0], this.position[1]);
        this.position[0] += this.speed * Math.cos(this.deg2rad(this.angle));
        this.position[1] += this.speed * Math.sin(this.deg2rad(this.angle));
        this.context.lineTo(this.position[0], this.position[1]);
        this.context.stroke();
    }
    tick() {
        if (this.activeKeys.left) {
            this.angle -= 2;
        }
        else if (this.activeKeys.right) {
            this.angle += 2;
        }
        this.movePlayer();
    }
    createControls(player) {
        switch (player) {
            case 1:
                document.addEventListener("keydown", (e) => {
                    if (e.key === "ArrowLeft") {
                        this.activeKeys.left = true;
                        console.log(this.activeKeys.left);
                    }
                    if (e.key === "ArrowRight") {
                        this.activeKeys.right = true;
                        console.log(this.activeKeys.left);
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
    deg2rad(deg) {
        return (Math.PI / 180) * deg;
    }
}
export default Player;
//# sourceMappingURL=Player.js.map