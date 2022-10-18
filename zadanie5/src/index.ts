class Snake {
    field: number[][]
    snek: number[][]
    rotation: number
    constructor(size: number) {
        this.field = this.createField(size)
        this.rotation = Math.floor(Math.random() * 4)
        this.snek = this.createSnake(this.field)
        this.drawField(size)
        console.table(this.field)
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

    drawField(size: number) {
        let w = window.innerWidth
        let cellSize = Math.floor((w / 2) / size)
        let container = document.createElement("main")
        let table = document.createElement("table")
        for (let i = 0; i < size; i++) {
            let row = document.createElement("tr")
            for (let j = 0; j < size; j++) {
                let cell = document.createElement("td")
                cell.classList.add("cell")
                cell.style.width = `${cellSize}px`
                cell.style.height = `${cellSize}px`
                if ((i + j) % 2 === 0) {
                    cell.classList.add("dark")
                }
                else { 
                    cell.classList.add("light")
                }
                row.appendChild(cell)
            }
            table.appendChild(row)
        }
        container.appendChild(table)
        document.body.appendChild(container)
    }

    createSnake(field: number[][]) {
        let x = Math.floor(Math.random() * (field[0].length - 10)) + 5 // make sure snek does not spawn in a wall
        let y = Math.floor(Math.random() * (field.length - 10)) + 5 // make sure snek does not spawn in a wall
        let snek = [[x, y]]
        field[y][x] = -1
        return snek
    }
}

let game = new Snake(20)