var Snek = /** @class */ (function () {
    function Snek(size, enablePears, enablePortals) {
        this.activePortal = false;
        this.teleport = false;
        this.portals = [];
        this.startPortal = [];
        this.endPortal = [];
        this.deletePortal = false;
        this.probability = 0;
        this.winningLength = 0;
        this.destroyGame();
        this.field = this.createField(size);
        Snek.rotation = Math.floor(Math.random() * 4);
        this.snek = this.createSnake(this.field);
        this.winningLength = size * size;
        this.createKeyboardEvents();
        Snek.interval = 500;
        this.drawField(size);
        if (enablePears)
            this.probability = 0.1;
        this.createFood();
        if (enablePortals)
            this.createPortalInterval();
        Snek.fastMode = false;
    }
    Snek.prototype.startGame = function () {
        Snek.moveInterval = this.createMoveInterval(Snek.interval);
    };
    Snek.prototype.createField = function (size) {
        var field = [];
        for (var i = 0; i < size; i++) {
            field[i] = [];
            for (var j = 0; j < size; j++)
                [(field[i][j] = 0)];
        }
        return field;
    };
    Snek.prototype.createSnake = function (field) {
        var x = Math.floor(Math.random() * (field[0].length - 10)) + 5; // make sure snek does not spawn in a wall
        var y = Math.floor(Math.random() * (field.length - 10)) + 5; // make sure snek does not spawn in a wall
        var snek = [[x, y]];
        return snek;
    };
    Snek.prototype.createKeyboardEvents = function () {
        window.onkeydown = function (e) {
            switch (e.code) {
                case "ArrowUp":
                    if (Snek.previousRotation !== 2) {
                        Snek.rotation = 0;
                    }
                    break;
                case "ArrowDown":
                    if (Snek.previousRotation !== 0) {
                        Snek.rotation = 2;
                    }
                    break;
                case "ArrowRight":
                    if (Snek.previousRotation !== 3) {
                        Snek.rotation = 1;
                    }
                    break;
                case "ArrowLeft":
                    if (Snek.previousRotation !== 1) {
                        Snek.rotation = 3;
                    }
                    break;
                case "Space":
                    Snek.fastMode = true;
                    break;
                default:
                    return;
            }
        };
        window.onkeyup = function (e) {
            switch (e.code) {
                case "Space":
                    Snek.fastMode = false;
                    break;
                default:
                    return;
            }
        };
    };
    Snek.prototype.createMoveInterval = function (time) {
        var _this = this;
        var moveInterval = setInterval(function () {
            _this.moveSnake(_this.field, _this.snek, Snek.rotation);
        }, time);
        return moveInterval;
    };
    Snek.prototype.createPortalInterval = function () {
        var _this = this;
        Snek.portalInterval = setInterval(function () {
            if (Math.random() < 1 && !_this.activePortal) {
                var x1 = Math.floor(Math.random() * (_this.field[0].length - 4)) + 2;
                var y1 = Math.floor(Math.random() * (_this.field.length - 4)) + 2;
                var x2 = Math.floor(Math.random() * (_this.field[0].length - 4)) + 2;
                var y2 = Math.floor(Math.random() * (_this.field.length - 4)) + 2;
                var premise = true;
                for (var i = x1 - 2; i < x1 + 2; i++) {
                    for (var j = y1 - 2; j < y1 + 2; j++) {
                        if (i === x2 && j === y2)
                            premise = false;
                    }
                }
                if (_this.field[y1][x1] === 0 && _this.field[y2][x2] === 0 && premise) {
                    _this.activePortal = true;
                    var index = y1 * _this.field.length + x1;
                    var cell = document.querySelectorAll(".cell")[index];
                    _this.field[y1][x1] = 3;
                    _this.field[y2][x2] = 4;
                    cell.classList.add("portal");
                    index = y2 * _this.field.length + x2;
                    cell = document.querySelectorAll(".cell")[index];
                    cell.classList.add("portal");
                    _this.portals = [
                        [y1, x1],
                        [y2, x2],
                    ];
                    _this.deletePortal = false;
                }
            }
        }, 1000);
    };
    Snek.prototype.drawField = function (size) {
        var w = window.innerWidth;
        var cellSize = Math.floor(w / 3 / size);
        var container = document.createElement("main");
        container.classList.add("container");
        var table = document.createElement("table");
        for (var i = 0; i < size; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < size; j++) {
                var cell = document.createElement("td");
                cell.classList.add("cell");
                cell.style.width = "".concat(cellSize, "px");
                cell.style.height = "".concat(cellSize, "px");
                if ((i + j) % 2 === 0) {
                    cell.classList.add("dark");
                }
                else {
                    cell.classList.add("light");
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        container.appendChild(table);
        document.body.appendChild(container);
    };
    Snek.prototype.moveSnake = function (field, snek, rotation) {
        var _this = this;
        var cells = document.querySelectorAll(".cell");
        var newTile = [];
        Snek.previousRotation = Snek.rotation;
        if (this.teleport) {
            newTile = this.endPortal;
            this.startPortal = [];
            this.teleport = false;
        }
        else {
            switch (rotation) {
                case 0:
                    newTile = [snek[0][0] - 1, snek[0][1]];
                    break;
                case 1:
                    newTile = [snek[0][0], snek[0][1] + 1];
                    break;
                case 2:
                    newTile = [snek[0][0] + 1, snek[0][1]];
                    break;
                case 3:
                    newTile = [snek[0][0], snek[0][1] - 1];
                    break;
            }
        }
        if (newTile[0] < 0 ||
            newTile[0] >= field.length ||
            newTile[1] < 0 ||
            newTile[1] >= field.length ||
            field[newTile[0]][newTile[1]] === -1) {
            clearInterval(Snek.moveInterval);
            this.createAlert("Game Over", "red");
            if (document.querySelector(".form")) {
                // @ts-expect-error
                document.querySelector(".form").style.display = "block";
                window.setTimeout(function () {
                    // @ts-expect-error
                    document.querySelector(".form").style.opacity = "1";
                    // @ts-expect-error
                    document.querySelector(".form").style.scale = "1";
                }, 1);
            }
            return;
        }
        else if (field[newTile[0]][newTile[1]] === 0) {
            snek.unshift(newTile);
            var index = newTile[0] * this.field.length + newTile[1];
            cells[index].classList.add("snek");
            var lastTile = snek.pop();
            field[lastTile[0]][lastTile[1]] = 0;
            index = lastTile[0] * this.field.length + lastTile[1];
            cells[index].classList.remove("snek");
        }
        else if (field[newTile[0]][newTile[1]] === 1) {
            // snek eats food
            snek.unshift(newTile);
            var index = newTile[0] * this.field.length + newTile[1];
            cells[index].classList.add("snek");
            if (this.snek.length <= this.winningLength - 1) {
                this.createFood();
            }
            cells[index].classList.remove("food");
            if (Snek.interval > 300) {
                Snek.interval -= 10;
            }
        }
        else if (field[newTile[0]][newTile[1]] === 2) {
            snek.unshift(newTile);
            var index = newTile[0] * this.field.length + newTile[1];
            cells[index].classList.add("snek");
            this.createFood();
            cells[index].classList.remove("pear");
            if (Snek.interval > 300) {
                Snek.interval -= 10;
            }
            snek.reverse();
            Snek.rotation = this.getRotation(snek[0], snek[1]);
        }
        else if (field[newTile[0]][newTile[1]] === 3) {
            snek.unshift(newTile);
            var index = newTile[0] * this.field.length + newTile[1];
            cells[index].classList.add("snek");
            var lastTile = snek.pop();
            field[lastTile[0]][lastTile[1]] = 0;
            index = lastTile[0] * this.field.length + lastTile[1];
            cells[index].classList.remove("snek");
            this.teleport = true;
            this.startPortal = [this.portals[0][0], this.portals[0][1]];
            this.endPortal = [this.portals[1][0], this.portals[1][1]];
            field[this.portals[1][0]][this.portals[1][1]] = 0;
            field[this.portals[0][0]][this.portals[0][1]] = 0;
        }
        else if (field[newTile[0]][newTile[1]] === 4) {
            snek.unshift(newTile);
            var index = newTile[0] * this.field.length + newTile[1];
            cells[index].classList.add("snek");
            var lastTile = snek.pop();
            field[lastTile[0]][lastTile[1]] = 0;
            index = lastTile[0] * this.field.length + lastTile[1];
            cells[index].classList.remove("snek");
            this.teleport = true;
            this.startPortal = [this.portals[1][0], this.portals[1][1]];
            this.endPortal = [this.portals[0][0], this.portals[0][1]];
            field[this.portals[1][0]][this.portals[1][1]] = 0;
            field[this.portals[0][0]][this.portals[0][1]] = 0;
        }
        if (this.portals.length > 0 &&
            this.snek.some(function (tile) {
                return (tile[0] === _this.portals[0][0] && tile[1] === _this.portals[0][1]) ||
                    (tile[0] === _this.portals[1][0] && tile[1] === _this.portals[1][1]);
            })) {
            console.log("in a portal");
            this.deletePortal = true;
        }
        else if (this.portals.length > 0 && this.deletePortal) {
            document.querySelectorAll(".portal").forEach(function (cell) {
                cell.classList.remove("portal");
            });
            this.activePortal = false;
        }
        if (Snek.fastMode) {
            clearInterval(Snek.moveInterval);
            Snek.moveInterval = this.createMoveInterval(100);
        }
        else {
            clearInterval(Snek.moveInterval);
            Snek.moveInterval = this.createMoveInterval(Snek.interval);
        }
        field[newTile[0]][newTile[1]] = -1;
        this.colorSnake(snek);
        if (this.snek.length === this.winningLength) {
            clearInterval(Snek.moveInterval);
            clearInterval(Snek.portalInterval);
            this.createAlert("You win", "green");
            if (document.querySelector(".form")) {
                // @ts-expect-error
                document.querySelector(".form").style.display = "block";
            }
        }
    };
    Snek.prototype.colorSnake = function (snek) {
        var cells = document.querySelectorAll(".cell");
        var tailClass;
        if (document.getElementsByClassName("tail")[0]) {
            var helper = document.getElementsByClassName("tail")[0].classList;
            for (var i = 0; i < helper.length; i++) {
                if (helper[i] !== "cell" &&
                    helper[i] !== "dark" &&
                    helper[i] !== "light" &&
                    helper[i] !== "tail" &&
                    helper[i] !== "snek") {
                    tailClass = helper[i];
                }
            }
        }
        cells.forEach(function (cell) {
            cell.classList.remove("head");
            cell.classList.remove("tail");
            cell.classList.remove("bend");
            cell.classList.remove("up");
            cell.classList.remove("down");
            cell.classList.remove("left");
            cell.classList.remove("right");
        });
        if (snek.length > 2) {
            for (var i = 0; i < snek.length; i++) {
                if (i === 0) {
                    var index = snek[i][0] * this.field.length + snek[i][1];
                    cells[index].classList.add("head");
                    cells[index].classList.add(this.getRotationName(Snek.rotation));
                }
                else if (i === snek.length - 1) {
                    var index = snek[i][0] * this.field.length + snek[i][1];
                    cells[index].classList.add("tail");
                    if (cells[index].classList.contains("portal")) {
                        var vector = [
                            snek[i][0] - snek[i - 1][0],
                            snek[i][1] - snek[i - 1][1],
                        ];
                        if (vector[0] * vector[1] === 0) {
                            cells[index].classList.add(this.getRotationName(this.getRotation(snek[i - 1], snek[i])));
                        }
                        else {
                            cells[index].classList.add(tailClass);
                        }
                    }
                    else {
                        cells[index].classList.add(this.getRotationName(this.getRotation(snek[i - 1], snek[i])));
                    }
                }
                else {
                    if (cells[snek[i][0] * this.field.length + snek[i][1]].classList.contains("portal")) {
                        var vector = [
                            snek[i + 1][0] - snek[i][0],
                            snek[i + 1][1] - snek[i][1],
                        ];
                        if (vector[0] * vector[1] === 0) {
                            cells[snek[i][0] * this.field.length + snek[i][1]].classList.add(this.getRotationName(this.getRotation(snek[i], snek[i + 1])));
                        }
                        else {
                            cells[snek[i][0] * this.field.length + snek[i][1]].classList.add(this.getRotationName(this.getRotation(snek[i - 1], snek[i])));
                        }
                    }
                    else {
                        this.getBend(snek[i + 1], snek[i], snek[i - 1]);
                    }
                }
            }
        }
        else if (snek.length === 2) {
            var index = snek[0][0] * this.field.length + snek[0][1];
            cells[index].classList.add("head");
            cells[index].classList.add(this.getRotationName(Snek.rotation));
            index = snek[1][0] * this.field.length + snek[1][1];
            cells[index].classList.add("tail");
            cells[index].classList.add(this.getRotationName(this.getRotation(snek[0], snek[1])));
        }
        else {
            var index = snek[0][0] * this.field.length + snek[0][1];
            cells[index].classList.add("head");
            cells[index].classList.add(this.getRotationName(Snek.rotation));
        }
    };
    Snek.prototype.createFood = function () {
        var x = Math.floor(Math.random() * this.field[0].length);
        var y = Math.floor(Math.random() * this.field.length);
        if (this.field[y][x] === 0) {
            var index = y * this.field.length + x;
            var cell = document.querySelectorAll(".cell")[index];
            if (Math.random() < this.probability) {
                this.field[y][x] = 2;
                cell.classList.add("pear");
            }
            else {
                this.field[y][x] = 1;
                cell.classList.add("food");
            }
        }
        else {
            this.createFood();
        }
    };
    Snek.prototype.getRotationName = function (rotation) {
        switch (rotation) {
            case 0:
                return "up";
            case 1:
                return "right";
            case 2:
                return "down";
            case 3:
                return "left";
            default:
                return "";
        }
    };
    Snek.prototype.getBend = function (previous, current, next) {
        var cells = document.querySelectorAll(".cell");
        var index = current[0] * this.field.length + current[1];
        var vector = [next[0] - previous[0], next[1] - previous[1]];
        if (vector[0] * vector[1] !== 0) {
            var rotation = 0;
            if (current[0] === previous[0]) {
                if (vector[0] === 1) {
                    rotation += 2;
                    if (vector[1] === 1) {
                        rotation += 1;
                    }
                }
                else {
                    if (vector[1] === -1) {
                        rotation += 1;
                    }
                }
            }
            else {
                if (vector[0] === -1) {
                    rotation += 2;
                    if (vector[1] === -1) {
                        rotation += 1;
                    }
                }
                else {
                    if (vector[1] === 1) {
                        rotation += 1;
                    }
                }
            }
            cells[index].classList.add("bend");
            cells[index].classList.add(this.getRotationName(rotation));
        }
        else {
            cells[index].classList.add(this.getRotationName(this.getRotation(current, previous)));
        }
    };
    Snek.prototype.getRotation = function (first, second) {
        if (first[0] === second[0]) {
            if (first[1] > second[1]) {
                return 1;
            }
            else {
                return 3;
            }
        }
        else {
            if (first[0] > second[0]) {
                return 2;
            }
            else {
                return 0;
            }
        }
    };
    Snek.prototype.destroyGame = function () {
        clearInterval(Snek.moveInterval);
        clearInterval(Snek.portalInterval);
        if (document.getElementsByClassName("container")[0]) {
            document.getElementsByClassName("container")[0].remove();
        }
        if (document.querySelector(".form")) {
            // @ts-expect-error
            document.querySelector(".form").style.opacity = "0";
            // @ts-expect-error
            document.querySelector(".form").style.scale = "0";
            window.setTimeout(function () {
                // @ts-expect-error
                document.querySelector(".form").style.display = "none";
            }, 500);
        }
    };
    Snek.prototype.createAlert = function (text, color) {
        var alert = document.createElement("div");
        alert.classList.add("alert");
        alert.classList.add(color);
        alert.innerText = text;
        document.body.appendChild(alert);
        setTimeout(function () {
            alert.style.opacity = "1";
            alert.style.scale = "1";
        }, 1);
        setTimeout(function () {
            alert.style.opacity = "0";
            alert.style.scale = "0";
            setTimeout(function () {
                alert.remove();
            }, 300);
        }, 3000);
    };
    Snek.previousRotation = -1;
    return Snek;
}());
function createForm() {
    var form = document.createElement("div");
    form.classList.add("form");
    var inputWrapper = document.createElement("p");
    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", "6");
    input.setAttribute("max", "20");
    input.setAttribute("value", "10");
    var inputLabel = document.createElement("label");
    inputLabel.innerText = "Cell count (one side)";
    inputWrapper.append(inputLabel, input);
    var pearWrapper = document.createElement("p");
    var pearInput = document.createElement("input");
    pearInput.setAttribute("type", "checkbox");
    var pearInputLabel = document.createElement("label");
    pearInputLabel.innerText = "Enable pears? ";
    pearWrapper.append(pearInputLabel, pearInput);
    var portalWrapper = document.createElement("p");
    var portalInput = document.createElement("input");
    portalInput.setAttribute("type", "checkbox");
    var portalInputLabel = document.createElement("label");
    portalInputLabel.innerText = "Enable portals? ";
    portalWrapper.append(portalInputLabel, portalInput);
    var button = document.createElement("button");
    button.innerText = "Start";
    button.onclick = function () {
        var cells = parseInt(input.value);
        var pear = pearInput.checked;
        var portal = portalInput.checked;
        if (cells >= 6 && cells <= 20) {
            var game = new Snek(cells, pear, portal);
            game.startGame();
        }
    };
    form.append(inputWrapper, pearWrapper, portalWrapper, button);
    document.body.append(form);
}
createForm();
