let game = 0

class mineSweeper {
    constructor(width, height, count) {
        mineSweeper.destroyGame()
        this.timeInterval = null
        this.width = width
        this.height = height
        this.count = count
        this.remainingBombs = count
        this.initial = true
        this.field = this.generateField(width, height)
        this.drawField(this.field, this.initial, this.count, this.remainingBombs)
    }

    generateField(x, y) {
        let field = [];
        for (let i = 0; i < x; i++) {
            field[i] = [];
            for (let j = 0; j < y; j++) {
                field[i][j] = 0;
            }
        }
        return field
    }

    drawField(field) {
        let x = field.length;
        let y = field[0].length;
    
        let table = document.createElement("table");
        for (let i = 0; i < x; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < y; j++) {
                let td = document.createElement("td");
                td.classList.add("cell");
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        let main = document.createElement("main");
        main.classList.add("field")
        main.id = "field"
        document.body.appendChild(main)
        let bombs = document.createElement("div")
        bombs.id = "remaining-bombs"
        bombs.innerText = `Bombs left: ${this.count}`
        main.appendChild(bombs)
        let time = document.createElement("div")
        time.id = "time"
        time.innerText = "Time: 0s"
        main.appendChild(time)
        document.getElementsByClassName("field")[0].appendChild(table);
        this.generateEvents(field, this.initial, this.count, this.remainingBombs)
    }

    generateEvents(field, initial, count, remainingBombs) {
        let cells = document.getElementsByClassName("cell")
        let startTime
        let timeInterval
        for (let i = 0; i < cells.length; i++) {
            cells[i].dataset.position = 1;
            cells[i].onclick = function handleClick(){
                let x = i % field[0].length
                let y = Math.floor(i / field[0].length)
                if (cells[i].dataset.position === "1") {
                    if (initial) {
                        initial = false
                        let mines = mineSweeper.generateMines(field, x, y, count)
                        mineSweeper.countMines(field, mines)
                        startTime = new Date().getTime()
                        mineSweeper.handleInterval(startTime)
                    }
                    mineSweeper.uncoverFields(field, x, y, startTime, count)
                }
            }
            cells[i].oncontextmenu = function handleRightClick(e) {
                e.preventDefault()
                let skip = false
                let position = parseInt(this.dataset.position)
                if (position === 1 && remainingBombs === 0) {
                    skip = true
                    position++
                }
                if (position === 1) {
                    this.classList.remove("flag")
                    this.classList.remove("question")
                    this.classList.add("flag")
                    remainingBombs--
                    position++
                }
                else if (position === 2) {
                    this.classList.remove("flag")
                    this.classList.remove("question")
                    cells[i].classList.add("question")
                    if (!skip) {
                        remainingBombs++
                    }
                    position = 0
                }
                else {
                    this.classList.remove("flag")
                    this.classList.remove("question")
                    position++
                }
                this.dataset.position = position
                document.getElementById("remaining-bombs").innerText = `Bombs left: ${remainingBombs}`
            }
        }
    }

    static handleInterval(startTime) {
        this.timeInterval = setInterval(() => {
            time.innerText = `Time: ${Math.round((new Date().getTime() - startTime) / 1000)}s`
            console.log("Szmata")
        }, 1000)
        console.log(this.timeInterval)
    }
    
    static generateMines(field, initialX, initialY, count) {
        let x = field[0].length;
        let y = field.length;
        let mines = []
        for (let i = initialY - 1; i <= initialY + 1; i++) {
            for (let j = initialX - 1; j <= initialX + 1; j++) {
                if (i >= 0 && i < y && j >= 0 && j < x) { 
                    field[i][j] = -2
                }
            }
        }
        for (let i = 0; i < count; i++) {
            let x1 = Math.floor(Math.random() * x);
            let y1 = Math.floor(Math.random() * y);
            if (field[y1][x1] === 0) {
                field[y1][x1] = -1;
                mines.push([y1, x1])
            } else {
                i--;
            }
        }
        for (let i = initialY - 1; i <= initialY + 1; i++) {
            for (let j = initialX - 1; j <= initialX + 1; j++) {
                if (i >= 0 && i < y && j >= 0 && j < x) { 
                    field[i][j] = 0
                }
            }
        }
        return mines
    }
    
    static countMines(field, mines) {
        let y = field.length;
        let x = field[0].length;
        for (let i = 0; i < mines.length; i++) {
            let y1 = mines[i][0];
            let x1 = mines[i][1];
            for (let j = y1 - 1; j <= y1 + 1; j++) {
                for (let k = x1 - 1; k <= x1 + 1; k++) {
                    if (j >= 0 && j < y && k >= 0 && k < x && field[j][k] !== -1) {
                        field[j][k]++;
                    }
                }
            }
        }
    }
    
    static uncoverFields(field, clickX, clickY, startTime, mines) { 
        let cells = document.getElementsByClassName("cell")
        let clearCells = [[clickY, clickX]]
        let newCells = []
        if (field[clickY][clickX] === -1) {
            mineSweeper.handleLoose(field, clickX, clickY)
            return
        }
        if (field[clickY][clickX] === 0) {
            newCells.push([clickY, clickX])
        }
        while (newCells.length > 0) {
            let currentCheck = newCells.shift()
            for (let i = currentCheck[0] - 1; i <= currentCheck[0] + 1; i++) {
                for (let j = currentCheck[1] -1; j <= currentCheck[1] + 1; j++) {
                    if (i >= 0 && i < field.length && j >= 0 && j < field[0].length && !mineSweeper.checkEqual(i, j, clearCells)) {
                        if (field[i][j] === 0 ) {
                            newCells.push([i, j])
                            clearCells.push([i, j])
                        }
                        else if (field[i][j] > 0) {
                            clearCells.push([i, j])
                        }
                    }
                }
            }
        }
        for (let i = 0; i < clearCells.length; i++) {
            let index = (clearCells[i][0] * field[0].length) + clearCells[i][1]
            if (field[clearCells[i][0]][clearCells[i][1]] > 0) {
                cells[index].innerText = field[clearCells[i][0]][clearCells[i][1]]
                cells[index].classList.add(mineSweeper.handleColor(field[clearCells[i][0]][clearCells[i][1]]))
            }
            cells[index].classList.add("uncovered")
            field[clearCells[i][0]][clearCells[i][1]] = -3
            cells[index].onclick = null
            cells[index].oncontextmenu = (e) => e.preventDefault()
            
        }
        mineSweeper.handleWin(field, startTime, mines)
    }
    
    static handleLoose(field, clickX, clickY) {
        clearInterval(this.timeInterval)
        let cells = document.getElementsByClassName("cell")
        let mines = []
        let y = field.length;
        let x = field[0].length;
    
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                if (field[i][j] === -1) {
                    mines.push([i, j])
                }
            }
        }
        let initialIndex = (clickY * field[0].length) + clickX
        cells[initialIndex].classList.add("click-bomb")
        let interval = 2000 / mines.length
        if (interval < 10) {
            while (mines.length > 0) {
                let order = Math.floor(Math.random() * mines.length);
                let currentMine = mines.splice(order, 1)[0]
                let index = (currentMine[0] * field[0].length) + currentMine[1]
                if (index !== initialIndex) {
                    cells[index].classList.add("bomb")
                }
            }   
        }
        else {
            let animateBombs = setInterval(() => {
                if (mines.length <= 1) {
                    clearInterval(animateBombs)
                }
                let order = Math.floor(Math.random() * mines.length);
                let currentMine = mines.splice(order, 1)[0]
                let index = (currentMine[0] * field[0].length) + currentMine[1]
                if (index !== initialIndex) {
                    cells[index].classList.add("bomb")
                }
            }, interval)
        }
        for (let i = 0; i < cells.length; i++) {
            cells[i].onclick = null
            cells[i].oncontextmenu = (e) => e.preventDefault()
        }
    }
    
    static handleWin(field, startTime, mines) {
        let remainingFields = 0
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[0].length; j++) {
                if (field[i][j] > 0) {
                    remainingFields++
                }
            }
        }
        if (remainingFields === 0) {
            clearInterval(this.timeInterval)
            window.alert("You win!")
            let endTime = (new Date().getTime())
            let time = endTime - startTime
            time = Math.round(time / 10) / 100 
            createCookie(time, field[0].length, field.length, mines)
            populteScoreBoard(field[0].length, field.length, mines)
        }
    }

    static checkEqual(y, x, clear) {
        for (let i = 0; i < clear.length; i++) {
            if (clear[i][0] === y && clear[i][1] === x) {
                return true
            }
        }
        return false
    }

    static handleColor(number) {
        switch (number) {
            case 1:
                return "one"
            case 2:
                return "two"
            case 3:
                return "three"
            case 4:
                return "four"
            case 5:
                return "five"
            case 6:
                return "six"
            case 7:
                return "seven"
            case 8:
                return "eight"
            default:
                return ""
        }
    }

    static destroyGame() {
        if (document.getElementById("field")) {
            document.getElementById("field").remove()
        }
        clearInterval(this.timeInterval)
    }
}

function createForm() {
    let inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")

    let widthLabel = document.createElement("label")
    widthLabel.innerText = "Width: "
    let widthInput = document.createElement("input")
    widthInput.value = 10
    widthInput.oninput = () => handleInput(widthInput)

    let heightLabel = document.createElement("label")
    heightLabel.innerText = "Height: "
    let heightInput = document.createElement("input")
    heightInput.value = 10
    heightInput.oninput = () => handleInput(heightInput)

    let mineLabel = document.createElement("label")
    mineLabel.innerText = "Mines: "
    let mineInput = document.createElement("input")
    mineInput.value = 2
    mineInput.oninput = () => handleInput(mineInput)

    let button = document.createElement("button")
    button.innerText = "Start Game"

    document.body.appendChild(inputContainer)
    inputContainer.appendChild(widthLabel)
    inputContainer.appendChild(widthInput)
    inputContainer.appendChild(heightLabel)
    inputContainer.appendChild(heightInput)
    inputContainer.appendChild(mineLabel)
    inputContainer.appendChild(mineInput)
    inputContainer.appendChild(button)

    button.onclick = () => {
        let width = parseInt(widthInput.value)
        let height = parseInt(heightInput.value)
        let mines = parseInt(mineInput.value)
        if (mines > width * height - 9) {
            window.alert("Too many mines!")
            return
        }
        else if (width > 0 && height > 0 && mines > 0) {
            game = null
            game = new mineSweeper(width, height, mines)
            populteScoreBoard(width, height, mines)
        }
        else {
            window.alert("Invalid input!")
        }
    }
}

function createScoreBoard() {
    let scoreBoard = document.createElement("div")
    scoreBoard.classList.add("score-board")
    let scoreBoardTitle = document.createElement("h2")
    scoreBoardTitle.innerText = "Score Board"
    let scoreBoardList = document.createElement("ol")
    scoreBoardList.id = "score-board-list"
    document.body.appendChild(scoreBoard)
    scoreBoard.appendChild(scoreBoardTitle)
    scoreBoard.appendChild(scoreBoardList)
}

function populteScoreBoard(width, height, mines) {
    let scoreBoardList = document.getElementById("score-board-list")
    scoreBoardList.innerHTML = ""
    let id = `${width}x${height}x${mines}`
    let scores = getCookies(id)
    if (scores) {
        for (let i = 0; i < scores.length; i++) {
            let score = document.createElement("li")
            scores[i][0] = scores[i][0].replaceAll("\\", "")
            scores[i][0] = scores[i][0].replaceAll('"', "")
            score.innerText = `${scores[i][0]} - ${scores[i][1]}s`
            scoreBoardList.appendChild(score)
        }
    }
}

function createCookie(time, width, height, mines) {
    let id = `${width}x${height}x${mines}`
    let currentCookie = getCookies(id)
    let nick = window.prompt("Enter your name: ")
    if (nick === null) {
        nick = "Anonymous"
    }
    if (currentCookie) {
        currentCookie.push([nick, time])
    }
    else {
        currentCookie = [[nick, time]]
    }
    var sortedArray = currentCookie.sort(function(a, b) {
        return a[1] - b[1];
    });
    if (sortedArray.length > 10) {
        sortedArray.pop()
    }
    for (let i = 0; i < sortedArray.length; i++) {
        sortedArray[i][0] = sortedArray[i][0].replaceAll("\\", "")
        sortedArray[i][0] = sortedArray[i][0].replaceAll('"', "")
    }
    document.cookie = `${id}=${JSON.stringify(sortedArray)};  expires=Fri, 01 Jan 2038 00:00:00 GMT; secure; samesite=strict`
}

function getCookies(id) {
    let string = document.cookie
    string = string.split(";")
    let obj = {}
    for (let i = 0; i < string.length; i++) {
        let current = string[i].split("=")
        let size = current[0].replaceAll(" ", "")
        let scores = current[1]
        if (scores) {
            scores = scores.split("],[")
            for (let j = 0; j < scores.length; j++) {
                scores[j] = scores[j].replaceAll("[", "")
                scores[j] = scores[j].replaceAll("]", "")
                scores[j] = scores[j].replaceAll(" ", "")
                scores[j] = scores[j].split(",")
                scores[j][1] = parseFloat(scores[j][1])
            }
            obj[size] = scores
        }
        
    }
    return obj[id]
}

function handleInput(element) {
    let timeout
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        if (isNaN(element.value)) {
            element.value = ""
        }
    }, 1000)
}

createForm()
createScoreBoard()
populteScoreBoard(10, 10, 2)
game = new mineSweeper(10, 10, 2)