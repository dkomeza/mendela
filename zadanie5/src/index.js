var Snek = /** @class */ (function () {
    function Snek(size) {
        this.field = this.createField(size);
        Snek.rotation = Math.floor(Math.random() * 4);
        this.snek = this.createSnake(this.field);
        this.createKeyboardEvents();
        Snek.moveInterval = this.createMoveInterval();
        this.drawField(size);
        console.table(this.field);
    }
    Snek.prototype.createField = function (size) {
        var field = [];
        for (var i = 0; i < size; i++) {
            field[i] = [];
            for (var j = 0; j < size; j++)
                [
                    field[i][j] = 0
                ];
        }
        console.table(field.length);
        return field;
    };
    Snek.prototype.createSnake = function (field) {
        var x = Math.floor(Math.random() * (field[0].length - 10)) + 5; // make sure snek does not spawn in a wall
        var y = Math.floor(Math.random() * (field.length - 10)) + 5; // make sure snek does not spawn in a wall
        var snek = [[x, y]];
        field[y][x] = -1;
        return snek;
    };
    Snek.prototype.createKeyboardEvents = function () {
        window.onkeydown = function (e) {
            switch (e.code) {
                case "Space":
                    Snek.startGame();
                    break;
                case "ArrowUp":
                    Snek.rotation = 0;
                    break;
                case "ArrowDown":
                    Snek.rotation = 2;
                    break;
                case "ArrowRight":
                    Snek.rotation = 1;
                    break;
                case "ArrowLeft":
                    Snek.rotation = 3;
                    break;
                default:
                    return;
            }
        };
    };
    Snek.prototype.createMoveInterval = function () {
        var _this = this;
        var moveInterval = setInterval(function () {
            _this.moveSnake(_this.field, _this.snek, Snek.rotation);
        }, 1000);
        return moveInterval;
    };
    Snek.prototype.drawField = function (size) {
        var w = window.innerWidth;
        var cellSize = Math.floor((w / 2) / size);
        var container = document.createElement("main");
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
        var newTile = [];
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
        snek.unshift(newTile);
        var lastTile = snek.pop();
        field[newTile[0]][newTile[1]] = -1;
        field[lastTile[0]][lastTile[1]] = 0;
    };
    Snek.startGame = function () {
        console.log("Start");
    };
    return Snek;
}());
var game = new Snek(20);
