import Track from "./Track.js";
import Player from "./Player.js";

window.onload = function () {
  startGame();
};

function startGame() {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 300;
  document.body.appendChild(canvas);
  const track = new Track(canvas);
  track.drawField();
  const player = new Player("red", canvas);
  player.createPlayer();
}

// function gameChoice() {
//   const dialogContainer = document.createElement("div");
//   dialogContainer.classList.add("dialog-container");

//   const buttonSingle = document.createElement("button")
//   const buttonMulti = document.createElement("button")

//   document.body.appendChild(dialogContainer);
// }
