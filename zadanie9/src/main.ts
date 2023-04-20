import Game from "./components/Game";
import UX from "./components/UX";
import Storage from "./components/Storage";
import "./scss/main.scss";

Storage.loadHighScore();

Game.start();
UX.addEventListener();
