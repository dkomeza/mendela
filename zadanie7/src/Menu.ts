interface Player {
  active: boolean;
  keys: {
    left: string;
    right: string;
  };
  name: string;
  number: number;
}

interface Players {
  [key: number]: Player;
}

const defaultKeys = [
  ["ArrowLeft", "ArrowRight"],
  ["a", "d"],
  ["j", "l"],
  ["4", "6"],
];

export default class Menu {
  callback: (players: Player[]) => void;
  updateCallback: (PlayerList?: Player[]) => void = () => {};
  players: Players = {};
  constructor(
    callback: (players: Player[]) => void,
    updateCallback: (PlayerList?: Player[]) => void
  ) {
    this.callback = callback;
    this.updateCallback = updateCallback;
    this.populatePlayers();
  }
  createMenu() {
    this.renderMenu();
  }
  renderMenu() {
    const menuWrapper = document.createElement("div");
    menuWrapper.classList.add("menu-wrapper");
    const menu = document.createElement("div");
    menu.classList.add("menu");
    for (let i = 1; i < 5; i++) {
      const menuOption = document.createElement("div");
      menuOption.classList.add("menu-option");
      menuOption.innerHTML = `<h2>Player ${i}</h2>`;
      const inputWrapper = document.createElement("div");
      inputWrapper.classList.add("input-wrapper");
      const leftInput = document.createElement("input");
      leftInput.value = this.players[i].keys.left;
      leftInput.onkeydown = (e) =>
        this.handleInput(e, leftInput, i, "left", menuOption, addButton);
      const rightInput = document.createElement("input");
      rightInput.value = this.players[i].keys.right;
      rightInput.onkeydown = (e) =>
        this.handleInput(e, rightInput, i, "right", menuOption, addButton);
      const addButton = document.createElement("button");
      addButton.innerHTML = "Add";
      addButton.onclick = () => this.handleAdd(i, menuOption, addButton);
      inputWrapper.appendChild(leftInput);
      inputWrapper.appendChild(rightInput);
      menuOption.append(inputWrapper);
      menuOption.append(addButton);
      menu.append(menuOption);
    }
    const startButton = document.createElement("button");
    startButton.classList.add("start-button");
    startButton.innerText = "Start";
    startButton.onclick = () => this.handleSubmit();
    menuWrapper.append(menu);
    menuWrapper.append(startButton);
    document.body.append(menuWrapper);
  }
  populatePlayers() {
    for (let i = 1; i < 5; i++) {
      this.players[i] = {
        active: false,
        name: `Player ${i}`,
        keys: {
          left: defaultKeys[i - 1][0],
          right: defaultKeys[i - 1][1],
        },
        number: i,
      };
    }
  }
  handleInput(
    event: KeyboardEvent,
    input: HTMLInputElement,
    player: number,
    direction: "left" | "right",
    menuOption: HTMLDivElement,
    button: HTMLButtonElement
  ) {
    event.preventDefault();
    for (const key in this.players) {
      if (
        this.players[key].keys.left === event.key ||
        this.players[key].keys.right === event.key
      ) {
        alert("Key already in use");
        return;
      }
    }
    const key = event.key;
    input.value = key;
    if (!this.players[player]) {
      this.players[player] = {
        active: true,
        name: `Player ${player}`,
        keys: {
          left: "",
          right: "",
        },
        number: player,
      };
    }
    if (direction === "left") {
      this.players[player].keys.left = key;
    } else {
      this.players[player].keys.right = key;
    }
    this.players[player].active = true;
    if (this.players[player].active) {
      menuOption.classList.add("active");
      button.innerHTML = "Remove";
    } else {
      menuOption.classList.remove("active");
      button.innerHTML = "Add";
    }
    this.updatePlayers(this.updateCallback);
  }
  handleAdd(
    player: number,
    menuOption: HTMLDivElement,
    button: HTMLButtonElement
  ) {
    this.players[player].active = this.players[player].active ? false : true;
    if (this.players[player].active) {
      menuOption.classList.add("active");
      button.innerHTML = "Remove";
    } else {
      menuOption.classList.remove("active");
      button.innerHTML = "Add";
    }
    this.updatePlayers(this.updateCallback);
  }
  handleSubmit() {
    if (this.getActivePlayers().length > 1) {
      this.callback(this.getActivePlayers()!);
    } else {
      alert("Please add at least two players");
    }
  }
  getActivePlayers() {
    const activePlayers = [];
    for (const key in this.players) {
      if (this.players[key].active) {
        activePlayers.push(this.players[key]);
      }
    }
    return activePlayers;
  }
  updatePlayers(callback: (PlayerList?: Player[]) => void) {
    callback(this.getActivePlayers());
  }
  hideMenu() {
    document.querySelector(".menu-wrapper")?.classList.add("hidden");
  }
  showMenu() {
    document.querySelector(".menu-wrapper")?.classList.remove("hidden");
  }
}
