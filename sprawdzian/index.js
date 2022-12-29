let container;
let basket;
let eggsDiv;
let eggCounter;
let liveCounter;
let eggs = [];
let basketPosition = [0, 0];
let eggCount = 0;
let lives = 3;

window.onload = () => {
  startGame();
};

function startGame() {
  container = document.getElementById("container");
  createBasket();
  handleKeyboard();
  createEggs();
  let i = 0;
  let interval = setInterval(() => {
    fallingEggs();
    i++;
    if (i >= 2) {
      clearInterval(interval);
    }
  }, 750);
}

function createBasket() {
  basket = document.createElement("div");
  basket.classList.add("basket");
  container.append(basket);
  eggCounter = document.createElement("div");
  eggCounter.classList.add("egg-counter");
  eggCounter.innerText = `Cought eggs: ${eggCount}`;
  container.append(eggCounter);
  liveCounter = document.createElement("div");
  liveCounter.classList.add("live-counter");
  liveCounter.innerText = `Remaining lives: ${lives}`;
  container.append(liveCounter);
}

function handleKeyboard() {
  window.addEventListener("keydown", function (e) {
    switch (e.code) {
      case "ArrowUp":
        basketPosition[1] = 0;
        break;
      case "ArrowDown":
        basketPosition[1] = 1;
        break;
      case "ArrowLeft":
        basketPosition[0] = 0;
        break;
      case "ArrowRight":
        basketPosition[0] = 1;
        break;
    }
    basket.style.top = `${basketPosition[1] * 300 + 180}px`;
    basket.style.left = `${basketPosition[0] * 150 + 100}px`;
  });
}

function createEggs() {
  for (let i = 0; i < 4; i++) {
    eggs[i] = [];
    let offset;
    if (i % 2 === 0) {
      offset = 0;
    } else {
      offset = 1;
    }
    let eggContainer = document.createElement("div");
    eggContainer.classList.add("eggContainer");
    eggContainer.style.left = `${offset * 300}px`;
    eggContainer.style.top = i - 1 > 0 ? "300px" : "0";
    for (let j = 0; j < 5; j++) {
      eggs[i][j] = 0;
      let egg = document.createElement("span");
      egg.classList.add("egg");
      if (offset) {
        egg.style.left = `${(4 - j) * 30}px`;
      } else {
        egg.style.left = `${j * 30}px`;
      }
      egg.style.top = `${j * 30}px`;
      eggContainer.append(egg);
    }
    container.append(eggContainer);
  }
}

function fallingEggs() {
  let index = Math.floor(Math.random() * 4);
  let eggPosition = 0;
  let cought = false;
  let fallen = false;
  let lastEgg;
  let lastIndex;
  setInterval(() => {
    if (lastEgg) {
      if (lastIndex === basketPosition[0] + basketPosition[1] * 2) {
        cought = true;
      } else {
        fallen = true;
      }
    }
    if (cought) {
      eggCount++;
      cought = false;
      eggCounter.innerText = `Cought eggs: ${eggCount}`;
      lastEgg.classList.remove("active");
      lastEgg = null;
    }
    if (fallen) {
      lastEgg.classList.remove("active");
      lastEgg = null;
      lives--;
      fallen = false;
      liveCounter.innerText = `Remaining lives: ${lives}`;
      if (!lives) {
        alert("You lost");
      }
    }
    let eggContainer = document.getElementsByClassName("eggContainer")[index];
    let eggs = eggContainer.children;
    for (let i = 0; i < eggs.length; i++) {
      eggs[i].classList.remove("active");
    }
    let currentEgg = eggContainer.children[eggPosition];
    currentEgg.classList.add("active");
    if (eggPosition >= 4) {
      lastEgg = currentEgg;
      lastIndex = index;
      eggPosition = 0;
      index = Math.floor(Math.random() * 4);
    } else {
      eggPosition++;
    }
  }, 10000);
}
