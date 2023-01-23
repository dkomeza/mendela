import Track from "./Track.js";
import Player from "./Player.js";
import Menu from "./Menu.js";

let game: number;
let track: any;
let menu: any;
let playerList: any[] | undefined = [];
let deadPlayers: any[] = [];
let time = 0;

interface PlayerInterface {
  active: boolean;
  keys: {
    left: string;
    right: string;
  };
  name: string;
  number: number;
}

function createGame() {
  playerList = [];
  deadPlayers = [];
  document.querySelectorAll("canvas").forEach((canvas) => {
    canvas.remove();
  });
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  track = new Track(canvas);
  track.drawField();
}

function updatePlayers(PlayerList?: PlayerInterface[]) {
  track.drawField();
  playerList = PlayerList?.map((player) => {
    const newPlayer = new Player(track.canvas, player.number, 3);
    newPlayer.createPlayer();
    newPlayer.createControls(player.keys);
    return newPlayer;
  });
}

function startGame() {
  menu.hideMenu();
  deadPlayers = [];
  console.log(deadPlayers);
  time = performance.now();
  game = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  track.drawField();
  let now = performance.now();
  let delta = now - time;
  time = now;
  let winner: number = -1;
  const currentLaps = [];
  for (let player of playerList!) {
    currentLaps.push(player.tick(delta));
    if (player.checkCollision()) {
      deadPlayers.push(player);
      playerList = playerList!.filter((p) => p !== player);
    }
    if (player.checkFinishLine()) {
      console.log(player.number);
      winner = player.player;
    }
  }
  currentLaps.sort((a, b) => b - a);
  track.updateCurrentLap(currentLaps[0], 3);
  for (let player of deadPlayers) {
    player.fadePlayer(delta, true);
  }
  if (playerList!.length === 1) {
    winner = playerList![0].player;
    console.log("tf");
    alert(`Wygrał gracz ${winner}`);
    cancelAnimationFrame(game);
    document.querySelector(".menu-wrapper")?.remove();
    menu = new Menu(startGame, updatePlayers);
    menu.createMenu();
    return;
  } else if (winner > 0) {
    cancelAnimationFrame(game);
    alert(`Wygrał gracz ${winner}`);
    document.querySelector(".menu-wrapper")?.remove();
    menu = new Menu(startGame, updatePlayers);
    menu.createMenu();
    return;
  }
  game = requestAnimationFrame(gameLoop);
}

window.onload = function () {
  createGame();
  menu = new Menu(startGame, updatePlayers);
  menu.createMenu();
};

// function gameChoice() {
//   const dialogContainer = document.createElement("div");
//   dialogContainer.classList.add("dialog-container");

//   const buttonSingle = document.createElement("button")
//   const buttonMulti = document.createElement("button")

//   document.body.appendChild(dialogContainer);
// }
