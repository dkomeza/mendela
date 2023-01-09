import Track from "./Track.js";
import Player from "./Player.js";
window.onload = function () {
    startGame();
};
let game;
let track;
let playerList = [];
let deadPlayers = [];
let time = 0;
function startGame() {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    track = new Track(canvas);
    for (let i = 1; i < 5; i++) {
        const player = new Player(canvas, i, 2);
        player.createPlayer();
        player.createControls(i);
        playerList.push(player);
    }
    time = performance.now();
    game = requestAnimationFrame(gameLoop);
}
function gameLoop() {
    track.drawField();
    let now = performance.now();
    let delta = now - time;
    time = now;
    let winner = -1;
    for (let player of playerList) {
        player.tick(delta);
        if (player.checkCollision()) {
            deadPlayers.push(player);
            playerList = playerList.filter((p) => p !== player);
        }
        if (player.checkFinishLine()) {
            winner = player.player;
        }
    }
    for (let player of deadPlayers) {
        player.fadePlayer(delta, true);
    }
    if (playerList.length === 1) {
        winner = playerList[0].player;
        cancelAnimationFrame(game);
        alert(`Wygrał gracz ${winner}`);
        return;
    }
    else if (winner > 0) {
        cancelAnimationFrame(game);
        alert(`Wygrał gracz ${winner}`);
        return;
    }
    game = requestAnimationFrame(gameLoop);
}
// function gameChoice() {
//   const dialogContainer = document.createElement("div");
//   dialogContainer.classList.add("dialog-container");
//   const buttonSingle = document.createElement("button")
//   const buttonMulti = document.createElement("button")
//   document.body.appendChild(dialogContainer);
// }
//# sourceMappingURL=index.js.map