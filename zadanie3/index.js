window.addEventListener("load", () => {
    setInterval(bounce, 10)
    scrollHorizontally()
    scrollVertically()
    spinnyBoi()
})

let i = 1
let decreasing = true

function bounce() {
    i <= 0.5 ? decreasing = false : i >= 0.9999 ? decreasing = true : decreasing = decreasing
    if (decreasing) {
        i -= 0.001
        document.querySelector('.pic').style.width = `${i*100}%`
    }
    else {
        i += 0.001
        document.querySelector('.pic').style.width = `${i*100}%`
    }
}

function scrollHorizontally() {
    function scroll() {
        text.push(text[0])
        text.shift()
        input.value = text.join("")
    }

    let input = document.getElementById("input")
    let text = "Ciekawe czy uda ci się to zrobić"
    let spaces = 49 - text.length
    for (let i = 0; i < spaces; i++) {
        text += " "
    }
    input.value = text
    text = text.split("")
    console.log(text.length)
    setInterval(scroll, 300)
}

function scrollVertically() {
    function scroll() {
        textArray.unshift(textArray[textArray.length-1])
        textArray.pop()
        text.value = textArray.join("")
    }
    let textArray = [".... pierwszy punkt ....\n", ".... drugi punkt ....\n", ".... trzeci punkt ....\n", ".... czwarty punkt ....\n", ".... piąty punkt ....\n", ".... szósty punkt ....\n"]
    let text = document.getElementById("textarea")
    let fill = 10 - textArray.length

    for (let i = 0; i < fill; i++) {
        textArray.push("\n")
    }
    textArray.reverse()
    setInterval(scroll, 1000)
}

function spinnyBoi() {
    function spin() {
        if (rad >= 2 * Math.PI) {
            rad = 0
        }
        else {
            rad += Math.PI / 180
        }
        y = 150 * Math.sin(rad) + 150
        x = 150 * Math.cos(rad) + 150
        image.style.top = `${y}px`
        image.style.left = `${x}px`
    }
    let image = document.querySelector('.spin')
    let x = 0
    let y = 0
    let rad = 0
    image.style.top = `${y}px`
    image.style.left = `${x}px`
    setInterval(spin, 10)
}

// create tictac toe game
