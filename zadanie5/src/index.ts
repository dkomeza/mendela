class Snake {
    field: number[][]
    snek: number[][]
    static rotation: number
    constructor(size: number) {
        this.field = this.createField(size)
        Snake.rotation = Math.floor(Math.random() * 4)
        this.snek = this.createSnake(this.field)
        this.createEventListeners()
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

    createSnake(field: number[][]) {
        let x = Math.floor(Math.random() * (field[0].length - 10)) + 5 // make sure snek does not spawn in a wall
        let y = Math.floor(Math.random() * (field.length - 10)) + 5 // make sure snek does not spawn in a wall
        let snek = [[x, y]]
        field[y][x] = -1
        return snek
    }

    createEventListeners() {
        window.onkeydown = function(e) {
            switch(e.code) {
                case "Space": 
                    Snake.startGame()
                    break
                case "ArrowUp": 
                    Snake.rotation = 0
                    break
                case "ArrowDown": 
                    Snake.rotation = 2
                    break
                case "ArrowRight": 
                    Snake.rotation = 1
                    break
                case "ArrowLeft": 
                    Snake.rotation = 3
                    break
                default:
                    return
            }
        }
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

    static startGame() {
        console.log("Start")
    }
}

let game = new Snake(20)