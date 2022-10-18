class Snake {
    field: number[][]
    constructor(size: number) {
        this.field = this.createField(size)
        this.drawField(size)
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
}

let game = new Snake(20)