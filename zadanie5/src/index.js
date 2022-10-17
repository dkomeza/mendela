var Snake = /** @class */ (function () {
    function Snake(size) {
        this.field = this.createField(size);
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
    return Snake;
}());
var game = new Snake(500);
