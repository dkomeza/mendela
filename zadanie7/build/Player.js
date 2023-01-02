class Player {
    constructor(color, canvas) {
        this.angle = 0;
        this.color = color;
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.position = [this.width / 2, this.height - 25];
    }
    createPlayer() {
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.moveTo(this.position[0], this.position[1]);
        this.context.lineTo(this.position[0] + 5, this.position[1]);
        this.context.stroke();
    }
    tick() {
        console.log("Supcio");
    }
    createControls() { }
    deg2rad(deg) {
        return (Math.PI / 180) * deg;
    }
}
export default Player;
//# sourceMappingURL=Player.js.map