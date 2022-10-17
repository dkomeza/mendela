class Snake {
    field: number[][]
    constructor(size: number) {
        this.field = this.createField(size)
    }

    createField(size: number) {
        let field: number[][] = []
        for (let i = 0; i < size; i++) {
            field[i] = []
            for (let j = 0; j < size; j++) [
                field[i][j] = 0
            ]
        }
        console.table(field.length)
        return field
    }
}

let game = new Snake(500)