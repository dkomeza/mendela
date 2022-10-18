var Snake = /** @class */ (function () {
    function Snake(size) {
        this.field = this.createField(size);
        this.drawField(size);
    }
    Snake.prototype.createField = function (size) {
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
    Snake.prototype.drawField = function (size) {
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
    return Snake;
}());
var game = new Snake(20);
