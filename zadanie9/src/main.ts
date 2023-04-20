import Game from "./components/Game";
import UX from "./components/UX";
import UI from "./components/UI";
import Storage from "./components/Storage";
import "./scss/main.scss";
import "./scss/ns.scss";

let ui = new UI();
Storage.setUI(ui);
Storage.loadHighScore();
ui.createScore();

let game: Game;

document.getElementById("start")!.addEventListener("click", start);
document.getElementById("restart")!.addEventListener("click", restart);

function start() {
  if (game) {
    return;
  }
  ui = new UI();
  Storage.setUI(ui);
  Storage.loadHighScore();
  game = new Game();
  game.setUI(ui);
  game.start();
  UX.setGame(game);
  UX.addEventListener();
}

function restart() {
  if (game) {
    game.removeInterval();
  }
  document.getElementById("screen")!.innerHTML = `<div id="hand">
  <img src="/img/hands/up_1.png" />
  <img src="/img/hands/up_2.png" />
  <img src="/img/hands/up_3.png" />
</div>`;
  ui = new UI();
  Storage.setUI(ui);
  Storage.loadHighScore();
  game = new Game();
  game.setUI(ui);
  game.start();
  UX.setGame(game);
}
